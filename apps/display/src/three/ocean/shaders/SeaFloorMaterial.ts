/**
 * Sea-floor / underwater object shader materials — ported from Three.js-Ocean-Scene
 *
 * Two variants:
 *  1. **Object** — UV-based texturing with directional lighting, underwater
 *     absorption, spotlight, and above-water fog.
 *  2. **Triplanar** — triplanar-projected texturing (sand, rock, etc.) with
 *     the same lighting model.
 *
 * Both support the camera being above or below the water surface.
 */
import {
  ShaderMaterial,
  Texture,
  Uniform,
  Vector3,
} from 'three';

import { SHADER_CHUNK_OCEAN } from './shaderConstants';
import {
  DEFAULT_BLEND_SHARPNESS,
  DEFAULT_SPOT_LIGHT_DISTANCE,
  DEFAULT_SPOT_LIGHT_SHARPNESS,
  DEFAULT_TRIPLANAR_SCALE,
} from './shaderConstants';
import {
  type SkyShaderUniforms,
  setSkyboxUniforms,
} from './SkyShaderMaterial';

// ============================================================================
// UV-based object shader
// ============================================================================

// ---------------------------------------------------------------------------
// Vertex
// ---------------------------------------------------------------------------
export const objectVertexShader = /* glsl */ `
    varying vec3 _worldPos;
    varying vec3 _normal;
    varying vec2 _uv;

    void main()
    {
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        _worldPos = worldPos.xyz;
        _normal = normal;
        _uv = uv;
        gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
`;

// ---------------------------------------------------------------------------
// Fragment
// ---------------------------------------------------------------------------
export const objectFragmentShader = /* glsl */ `
    ${SHADER_CHUNK_OCEAN}

    uniform vec3 _CameraForward;
    uniform sampler2D _MainTexture;
    uniform float _SpotLightSharpness;
    uniform float _SpotLightDistance;

    varying vec3 _worldPos;
    varying vec3 _normal;
    varying vec2 _uv;

    void main()
    {
        float dirLighting = max(0.333, dot(_normal, _DirToLight));
        vec3 tex = texture2D(_MainTexture, _uv).xyz * dirLighting;

        vec3 viewVec = _worldPos - cameraPosition;
        float viewLen = length(viewVec);
        vec3 viewDir = viewVec / viewLen;

        if (_worldPos.y > 0.0)
        {
            if (cameraPosition.y < 0.0)
            {
                viewLen -= cameraPosition.y / -viewDir.y;
            }

            sampleDither(gl_FragCoord.xy);
            vec3 fogColor = sampleFog(viewDir);
            float fog = clamp(viewLen / FOG_DISTANCE + dither, 0.0, 1.0);
            gl_FragColor = vec4(mix(tex, fogColor, fog), 1.0);
            return;
        }

        float originY = cameraPosition.y;

        if (cameraPosition.y > 0.0)
        {
            viewLen -= cameraPosition.y / -viewDir.y;
            originY = 0.0;
        }
        viewLen = min(viewLen, MAX_VIEW_DEPTH);

        float sampleY = originY + viewDir.y * viewLen;
        vec3 light = exp((sampleY - viewLen * DENSITY) * ABSORPTION) * _Light;

        float spotLight = 0.0;
        float spotLightDistance = 1.0;
        if (_SpotLightDistance > 0.0)
        {
            spotLightDistance = min(distance(_worldPos, cameraPosition) / _SpotLightDistance, 1.0);
            spotLight = pow(max(dot(viewDir, _CameraForward), 0.0), _SpotLightSharpness) * (1.0 - spotLightDistance);
        }

        light = min(light + spotLight, vec3(1.0));

        gl_FragColor = vec4(mix(tex * light, light, min(viewLen / MAX_VIEW_DEPTH, 1.0 - spotLight)), 1.0);
    }
`;

// ============================================================================
// Triplanar-textured object shader (sea floor, rocks, etc.)
// ============================================================================

// ---------------------------------------------------------------------------
// Vertex
// ---------------------------------------------------------------------------
export const triplanarVertexShader = /* glsl */ `
    varying vec3 _worldPos;
    varying vec3 _normal;

    void main()
    {
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        _worldPos = worldPos.xyz;
        _normal = normal;
        gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
`;

// ---------------------------------------------------------------------------
// Fragment
// ---------------------------------------------------------------------------
export const triplanarFragmentShader = /* glsl */ `
    ${SHADER_CHUNK_OCEAN}

    uniform vec3 _CameraForward;
    uniform sampler2D _MainTexture;
    uniform float _BlendSharpness;
    uniform float _Scale;
    uniform float _SpotLightSharpness;
    uniform float _SpotLightDistance;

    varying vec3 _worldPos;
    varying vec3 _normal;

    void main()
    {
        float dirLighting = max(0.4, dot(_normal, _DirToLight));

        vec3 weights = abs(_normal);
        weights = vec3(pow(weights.x, _BlendSharpness), pow(weights.y, _BlendSharpness), pow(weights.z, _BlendSharpness));
        weights = weights / (weights.x + weights.y + weights.z);

        vec3 textureX = texture2D(_MainTexture, _worldPos.yz * _Scale).xyz * weights.x;
        vec3 textureY = texture2D(_MainTexture, _worldPos.xz * _Scale).xyz * weights.y;
        vec3 textureZ = texture2D(_MainTexture, _worldPos.xy * _Scale).xyz * weights.z;

        vec3 tex = (textureX + textureY + textureZ) * dirLighting;

        vec3 viewVec = _worldPos - cameraPosition;
        float viewLen = length(viewVec);
        vec3 viewDir = viewVec / viewLen;

        if (_worldPos.y > 0.0)
        {
            if (cameraPosition.y < 0.0)
            {
                viewLen -= cameraPosition.y / -viewDir.y;
            }

            sampleDither(gl_FragCoord.xy);
            vec3 fogColor = sampleFog(viewDir);
            float fog = clamp(viewLen / FOG_DISTANCE + dither, 0.0, 1.0);
            gl_FragColor = vec4(mix(tex, fogColor, fog), 1.0);
            return;
        }

        float originY = cameraPosition.y;

        if (cameraPosition.y > 0.0)
        {
            viewLen -= cameraPosition.y / -viewDir.y;
            originY = 0.0;
        }
        viewLen = min(viewLen, MAX_VIEW_DEPTH);

        float sampleY = originY + viewDir.y * viewLen;
        vec3 light = exp((sampleY - viewLen * DENSITY) * ABSORPTION) * _Light;

        float spotLight = 0.0;
        float spotLightDistance = 1.0;
        if (_SpotLightDistance > 0.0)
        {
            spotLightDistance = min(distance(_worldPos, cameraPosition) / _SpotLightDistance, 1.0);
            spotLight = pow(max(dot(viewDir, _CameraForward), 0.0), _SpotLightSharpness) * (1.0 - spotLightDistance);
        }

        light = min(light + spotLight, vec3(1.0));

        gl_FragColor = vec4(mix(tex * light, light, min(viewLen / MAX_VIEW_DEPTH, 1.0 - spotLight)), 1.0);
    }
`;

// ---------------------------------------------------------------------------
// Factory: UV-based object material
// ---------------------------------------------------------------------------
export interface CreateSeaFloorObjectMaterialOptions {
  /** Shared sky uniforms (from createSkyMaterial). */
  skyUniforms: SkyShaderUniforms;
  /** Shared time uniform. */
  timeUniform?: Uniform<number>;
  /** The diffuse texture sampled via UV coordinates. */
  mainTexture?: Texture | null;
  /** Camera forward vector (for spotlight). */
  cameraForward?: Vector3;
  spotLightSharpness?: number;
  spotLightDistance?: number;
}

export function createSeaFloorObjectMaterial(
  options: CreateSeaFloorObjectMaterialOptions,
): ShaderMaterial {
  const uniforms: Record<string, Uniform> = {
    _Time: options.timeUniform ?? new Uniform(0),
    _NormalMap1: new Uniform(null),
    _NormalMap2: new Uniform(null),
    _MainTexture: new Uniform(options.mainTexture ?? null),
    _CameraForward: new Uniform(
      options.cameraForward ?? new Vector3(0, 0, -1),
    ),
    _SpotLightSharpness: new Uniform(
      options.spotLightSharpness ?? DEFAULT_SPOT_LIGHT_SHARPNESS,
    ),
    _SpotLightDistance: new Uniform(
      options.spotLightDistance ?? DEFAULT_SPOT_LIGHT_DISTANCE,
    ),
  };

  const material = new ShaderMaterial({
    vertexShader: objectVertexShader,
    fragmentShader: objectFragmentShader,
    uniforms,
  });

  setSkyboxUniforms(material, options.skyUniforms);

  return material;
}

// ---------------------------------------------------------------------------
// Factory: Triplanar-textured material (sea floor terrain)
// ---------------------------------------------------------------------------
export interface CreateSeaFloorTriplanarMaterialOptions {
  /** Shared sky uniforms (from createSkyMaterial). */
  skyUniforms: SkyShaderUniforms;
  /** Shared time uniform. */
  timeUniform?: Uniform<number>;
  /** The triplanar diffuse texture (e.g. sand). */
  mainTexture?: Texture | null;
  /** Camera forward vector (for spotlight). */
  cameraForward?: Vector3;
  blendSharpness?: number;
  scale?: number;
  spotLightSharpness?: number;
  spotLightDistance?: number;
}

export function createSeaFloorTriplanarMaterial(
  options: CreateSeaFloorTriplanarMaterialOptions,
): ShaderMaterial {
  const uniforms: Record<string, Uniform> = {
    _Time: options.timeUniform ?? new Uniform(0),
    _NormalMap1: new Uniform(null),
    _NormalMap2: new Uniform(null),
    _MainTexture: new Uniform(options.mainTexture ?? null),
    _CameraForward: new Uniform(
      options.cameraForward ?? new Vector3(0, 0, -1),
    ),
    _BlendSharpness: new Uniform(
      options.blendSharpness ?? DEFAULT_BLEND_SHARPNESS,
    ),
    _Scale: new Uniform(options.scale ?? DEFAULT_TRIPLANAR_SCALE),
    _SpotLightSharpness: new Uniform(
      options.spotLightSharpness ?? DEFAULT_SPOT_LIGHT_SHARPNESS,
    ),
    _SpotLightDistance: new Uniform(
      options.spotLightDistance ?? DEFAULT_SPOT_LIGHT_DISTANCE,
    ),
  };

  const material = new ShaderMaterial({
    vertexShader: triplanarVertexShader,
    fragmentShader: triplanarFragmentShader,
    uniforms,
  });

  setSkyboxUniforms(material, options.skyUniforms);

  return material;
}
