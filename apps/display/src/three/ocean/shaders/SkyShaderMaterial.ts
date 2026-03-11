/**
 * Sky shader material — ported from Three.js-Ocean-Scene
 *
 * Renders the skybox with day/night cycle, sun, moon, stars, twilight blending,
 * and blue-noise dithering.
 */
import {
  DataTexture,
  MathUtils,
  Matrix3,
  RepeatWrapping,
  ShaderMaterial,
  Texture,
  Uniform,
  Vector2,
  Vector3,
} from 'three';

import { SHADER_CHUNK_SKYBOX } from './shaderConstants';
import {
  DEFAULT_GRID_SIZE,
  DEFAULT_MAX_STAR_OFFSET,
  DEFAULT_STARS_COUNT,
  DEFAULT_STARS_SEED,
} from './shaderConstants';

// ---------------------------------------------------------------------------
// Vertex shader
// ---------------------------------------------------------------------------
export const skyVertexShader = /* glsl */ `
    uniform mat3 _SkyRotationMatrix;

    attribute vec3 coord;

    varying vec3 _worldPos;
    varying vec3 _coord;

    void main()
    {
        _worldPos = coord;
        _coord = _SkyRotationMatrix * _worldPos;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

// ---------------------------------------------------------------------------
// Fragment shader — skybox chunk is inlined
// ---------------------------------------------------------------------------
export const skyFragmentShader = /* glsl */ `
    ${SHADER_CHUNK_SKYBOX}

    varying vec3 _worldPos;
    varying vec3 _coord;

    void main()
    {
        vec3 worldDir = normalize(_worldPos);
        vec3 viewDir = normalize(_coord);

        float dither = (texture2D(_DitherTexture, (gl_FragCoord.xy - vec2(0.5)) / _DitherTextureSize).x - 0.5) * DITHER_STRENGTH;
        float density = clamp(pow2(1.0 - max(0.0, dot(worldDir, UP) + dither)), 0.0, 1.0);

        float sunLight = dot(viewDir, UP);
        float sun = min(pow(max(0.0, sunLight), SUN_SHARPNESS) * SUN_SIZE, 1.0);

        float moonLight = -sunLight;
        float moon = min(pow(max(0.0, moonLight), MOON_SHARPNESS) * MOON_SIZE, 1.0);

        vec3 day = mix(DAY_SKY_COLOR, DAY_HORIZON_COLOR, density);
        vec3 twilight = mix(LATE_TWILIGHT_COLOR, EARLY_TWILIGHT_COLOR, _TwilightTime);
        vec3 night = mix(NIGHT_SKY_COLOR, NIGHT_HORIZON_COLOR, density);

        vec3 sky = mix(night, day, _SunVisibility);
        sky = mix(sky, twilight, density * clamp(sunLight * 0.5 + 0.5 + dither, 0.0, 1.0) * _TwilightVisibility);

        vec2 cubeCoords = sampleCubeCoords(viewDir);
        vec4 gridValue = texture2D(_Stars, cubeCoords);

        vec2 gridCoords = vec2(cubeCoords.x * _GridSizeScaled, cubeCoords.y * _GridSize);
        vec2 gridCenterCoords = floor(gridCoords) + gridValue.xy;
        float stars = max(min(pow(1.0 - min(distance(gridCoords, gridCenterCoords), 1.0), STARS_SHARPNESS) * gridValue.z * STARS_SIZE, 1.0), moon);
        stars *= min(exp(-dot(sky, vec3(1.0)) * STARS_FALLOFF) * STARS_VISIBILITY, 1.0);

        sky = mix(sky, max(STARS_COLORS[int(gridValue.w * 6.0)], vec3(moon)), stars);
        sky = mix(sky, vec3(1.0), sun);

        gl_FragColor = vec4(sky, 1.0);
    }
`;

// ---------------------------------------------------------------------------
// Uniform types
// ---------------------------------------------------------------------------
export interface SkyShaderUniforms {
  _SkyRotationMatrix: Uniform<Matrix3>;
  _DitherTexture: Uniform<Texture | null>;
  _DitherTextureSize: Uniform<Vector2>;
  _SunVisibility: Uniform<number>;
  _TwilightTime: Uniform<number>;
  _TwilightVisibility: Uniform<number>;
  _MoonVisibility: Uniform<number>;
  _GridSize: Uniform<number>;
  _GridSizeScaled: Uniform<number>;
  _Stars: Uniform<Texture | null>;
  _SpecularVisibility: Uniform<number>;
  _DirToLight: Uniform<Vector3>;
  _Light: Uniform<Vector3>;
}

// ---------------------------------------------------------------------------
// Seeded PRNG — faithful port of the original Random class used for star gen
// ---------------------------------------------------------------------------
class SeededRandom {
  private state: number;

  constructor(seed: number) {
    this.state = seed;
  }

  next(): number {
    this.state = (this.state * 16807 + 0) % 2147483647;
    return this.state / 2147483647;
  }
}

// ---------------------------------------------------------------------------
// Star-map generation — writes star positions into a DataTexture
// ---------------------------------------------------------------------------
function generateStarMap(
  gridSize: number = DEFAULT_GRID_SIZE,
  starsCount: number = DEFAULT_STARS_COUNT,
  seed: number = DEFAULT_STARS_SEED,
  maxOffset: number = DEFAULT_MAX_STAR_OFFSET,
): DataTexture {
  const starsMap = new Uint8Array(gridSize * gridSize * 6 * 4);
  const random = new SeededRandom(seed);

  const vector3ToStarMap = (
    dir: Vector3,
    value: [number, number, number, number],
  ): void => {
    const absDir = new Vector3(
      Math.abs(dir.x),
      Math.abs(dir.y),
      Math.abs(dir.z),
    );

    const xPositive = dir.x > 0;
    const yPositive = dir.y > 0;
    const zPositive = dir.z > 0;

    let maxAxis = 0;
    let u = 0;
    let v = 0;
    let i = 0;

    if (xPositive && absDir.x >= absDir.y && absDir.x >= absDir.z) {
      maxAxis = absDir.x;
      u = -dir.z;
      v = dir.y;
      i = 0;
    }

    if (!xPositive && absDir.x >= absDir.y && absDir.x >= absDir.z) {
      maxAxis = absDir.x;
      u = dir.z;
      v = dir.y;
      i = 1;
    }

    if (yPositive && absDir.y >= absDir.x && absDir.y >= absDir.z) {
      maxAxis = absDir.y;
      u = dir.x;
      v = -dir.z;
      i = 2;
    }

    if (!yPositive && absDir.y >= absDir.x && absDir.y >= absDir.z) {
      maxAxis = absDir.y;
      u = dir.x;
      v = dir.z;
      i = 3;
    }

    if (zPositive && absDir.z >= absDir.x && absDir.z >= absDir.y) {
      maxAxis = absDir.z;
      u = dir.x;
      v = dir.y;
      i = 4;
    }

    if (!zPositive && absDir.z >= absDir.x && absDir.z >= absDir.y) {
      maxAxis = absDir.z;
      u = -dir.x;
      v = dir.y;
      i = 5;
    }

    const uu = Math.floor(((u / maxAxis + 1) * 0.5) * gridSize);
    const vv = Math.floor(((v / maxAxis + 1) * 0.5) * gridSize);

    const j = (vv * gridSize * 6 + i * gridSize + uu) * 4;
    starsMap[j] = value[0];
    starsMap[j + 1] = value[1];
    starsMap[j + 2] = value[2];
    starsMap[j + 3] = value[3];
  };

  for (let s = 0; s < starsCount; s++) {
    const a = random.next() * Math.PI * 2;
    const b = random.next() * 2 - 1;
    const c = Math.sqrt(1 - b * b);
    const target = new Vector3(Math.cos(a) * c, Math.sin(a) * c, b);

    vector3ToStarMap(target, [
      MathUtils.lerp(0.5 - maxOffset, 0.5 + maxOffset, random.next()) * 255,
      MathUtils.lerp(0.5 - maxOffset, 0.5 + maxOffset, random.next()) * 255,
      Math.pow(random.next(), 6) * 255,
      random.next() * 255,
    ]);
  }

  const texture = new DataTexture(starsMap, gridSize * 6, gridSize);
  texture.needsUpdate = true;
  return texture;
}

// ---------------------------------------------------------------------------
// Shared skybox uniform values — can be referenced by ocean materials too
// ---------------------------------------------------------------------------
export interface SkyState {
  uniforms: SkyShaderUniforms;
  /** Call once per frame to update sun/twilight visibility from the light direction. */
  update: () => void;
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------
export interface CreateSkyMaterialOptions {
  /** Blue-noise dither texture. Pass null to set later. */
  ditherTexture?: Texture | null;
  ditherTextureSize?: Vector2;
  /** Direction from origin toward the sun (normalised). */
  dirToLight?: Vector3;
  /** Sky rotation matrix (3x3). */
  skyRotationMatrix?: Matrix3;
  gridSize?: number;
  starsCount?: number;
  starsSeed?: number;
  maxStarOffset?: number;
}

/**
 * Creates the sky ShaderMaterial together with a `SkyState` that exposes the
 * shared uniforms (needed by the ocean materials) and an `update()` helper to
 * drive the day/night cycle each frame.
 */
export function createSkyMaterial(
  options: CreateSkyMaterialOptions = {},
): { material: ShaderMaterial; state: SkyState } {
  const gridSize = options.gridSize ?? DEFAULT_GRID_SIZE;
  const dirToLight = options.dirToLight ?? new Vector3(0, 1, 0);
  const skyRotationMatrix = options.skyRotationMatrix ?? new Matrix3();

  const up = new Vector3(0, 1, 0);
  let intensity = dirToLight.dot(up);

  const uniforms: SkyShaderUniforms = {
    _SkyRotationMatrix: new Uniform(skyRotationMatrix),
    _DitherTexture: new Uniform(options.ditherTexture ?? null),
    _DitherTextureSize: new Uniform(
      options.ditherTextureSize ?? new Vector2(256, 256),
    ),
    _SunVisibility: new Uniform(
      MathUtils.clamp((intensity + 0.1) * 2, 0, 1),
    ),
    _TwilightTime: new Uniform(
      MathUtils.clamp((intensity + 0.1) * 3, 0, 1),
    ),
    _TwilightVisibility: new Uniform(
      1 - Math.min(Math.abs(intensity * 3), 1),
    ),
    _MoonVisibility: new Uniform(0),
    _GridSize: new Uniform(gridSize),
    _GridSizeScaled: new Uniform(gridSize * 6),
    _Stars: new Uniform(
      generateStarMap(
        gridSize,
        options.starsCount ?? DEFAULT_STARS_COUNT,
        options.starsSeed ?? DEFAULT_STARS_SEED,
        options.maxStarOffset ?? DEFAULT_MAX_STAR_OFFSET,
      ),
    ),
    _SpecularVisibility: new Uniform(
      Math.sqrt(MathUtils.clamp((intensity + 0.1) * 2, 0, 1)),
    ),
    _DirToLight: new Uniform(dirToLight),
    _Light: new Uniform(new Vector3(1, 1, 1)),
  };

  const material = new ShaderMaterial({
    vertexShader: skyVertexShader,
    fragmentShader: skyFragmentShader,
    uniforms: uniforms as unknown as Record<string, Uniform>,
  });

  const update = (): void => {
    intensity = dirToLight.dot(up);
    const sunVis = MathUtils.clamp((intensity + 0.1) * 2, 0, 1);
    uniforms._SunVisibility.value = sunVis;
    uniforms._TwilightTime.value = MathUtils.clamp(
      (intensity + 0.1) * 3,
      0,
      1,
    );
    uniforms._TwilightVisibility.value =
      1 - Math.min(Math.abs(intensity * 3), 1);
    uniforms._SpecularVisibility.value = Math.sqrt(sunVis);
    const l = Math.min(sunVis + 0.333, 1);
    uniforms._Light.value.set(l, l, l);
  };

  return {
    material,
    state: { uniforms, update },
  };
}

/**
 * Copies the shared skybox uniforms onto another ShaderMaterial's uniform map.
 * This is the equivalent of the original `SetSkyboxUniforms()`.
 */
export function setSkyboxUniforms(
  target: ShaderMaterial,
  skyUniforms: SkyShaderUniforms,
): void {
  const u = target.uniforms;
  u._SkyRotationMatrix = skyUniforms._SkyRotationMatrix;
  u._DitherTexture = skyUniforms._DitherTexture;
  u._DitherTextureSize = skyUniforms._DitherTextureSize;
  u._SunVisibility = skyUniforms._SunVisibility;
  u._TwilightTime = skyUniforms._TwilightTime;
  u._TwilightVisibility = skyUniforms._TwilightVisibility;
  u._MoonVisibility = skyUniforms._MoonVisibility;
  u._GridSize = skyUniforms._GridSize;
  u._GridSizeScaled = skyUniforms._GridSizeScaled;
  u._Stars = skyUniforms._Stars;
  u._SpecularVisibility = skyUniforms._SpecularVisibility;
  u._DirToLight = skyUniforms._DirToLight;
  u._Light = skyUniforms._Light;
}
