/**
 * Ocean surface shader material — ported from Three.js-Ocean-Scene
 *
 * Renders the ocean surface with normal-map scrolling, Fresnel reflectivity,
 * Blinn-Phong specular, sky reflection, underwater absorption, and fog.
 * Supports both above-water and below-water camera positions.
 */
import {
  DoubleSide,
  ShaderMaterial,
  Texture,
  Uniform,
} from 'three';

import { SHADER_CHUNK_OCEAN } from './shaderConstants';
import {
  type SkyShaderUniforms,
  setSkyboxUniforms,
} from './SkyShaderMaterial';

// ---------------------------------------------------------------------------
// Vertex shader
// ---------------------------------------------------------------------------
export const oceanSurfaceVertexShader = /* glsl */ `
    ${SHADER_CHUNK_OCEAN}

    varying vec2 _worldPos;
    varying vec2 _uv;

    void main()
    {
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        _worldPos = worldPos.xz;
        _uv = _worldPos * NORMAL_MAP_SCALE;
        gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
`;

// ---------------------------------------------------------------------------
// Fragment shader
// ---------------------------------------------------------------------------
export const oceanSurfaceFragmentShader = /* glsl */ `
    ${SHADER_CHUNK_OCEAN}

    varying vec2 _worldPos;
    varying vec2 _uv;

    void main()
    {
        vec3 viewVec = vec3(_worldPos.x, 0.0, _worldPos.y) - cameraPosition;
        float viewLen = length(viewVec);
        vec3 viewDir = viewVec / viewLen;

        vec3 normal = texture2D(_NormalMap1, _uv + VELOCITY_1 * _Time).xyz * 2.0 - 1.0;
        normal += texture2D(_NormalMap2, _uv + VELOCITY_2 * _Time).xyz * 2.0 - 1.0;
        normal *= NORMAL_MAP_STRENGTH;
        normal += vec3(0.0, 0.0, 1.0);
        normal = normalize(normal).xzy;

        sampleDither(gl_FragCoord.xy);

        if (cameraPosition.y > 0.0)
        {
            vec3 halfWayDir = normalize(_DirToLight - viewDir);
            float specular = max(0.0, dot(normal, halfWayDir));
            specular = pow(specular, SPECULAR_SHARPNESS) * _SpecularVisibility;

            float reflectivity = pow2(1.0 - max(0.0, dot(-viewDir, normal)));

            vec3 reflection = sampleSkybox(reflect(viewDir, normal));
            vec3 surface = reflectivity * reflection;
            surface = max(surface, specular);

            float fog = clamp(viewLen / FOG_DISTANCE + dither, 0.0, 1.0);
            surface = mix(surface, sampleFog(viewDir), fog);

            gl_FragColor = vec4(surface, max(max(reflectivity, specular), fog));
            return;
        }

        float originY = cameraPosition.y;
        viewLen = min(viewLen, MAX_VIEW_DEPTH);
        float sampleY = originY + viewDir.y * viewLen;
        vec3 light = exp((sampleY - MAX_VIEW_DEPTH_DENSITY) * ABSORPTION);
        light *= _Light;

        float reflectivity = pow2(1.0 - max(0.0, dot(viewDir, normal)));
        float t = clamp(max(reflectivity, viewLen / MAX_VIEW_DEPTH) + dither, 0.0, 1.0);

        if (dot(viewDir, normal) < CRITICAL_ANGLE)
        {
            vec3 r = reflect(viewDir, -normal);
            sampleY = r.y * (MAX_VIEW_DEPTH - viewLen);
            vec3 rColor = exp((sampleY - MAX_VIEW_DEPTH_DENSITY) * ABSORPTION);
            rColor *= _Light;

            gl_FragColor = vec4(mix(rColor, light, t), 1.0);
            return;
        }

        gl_FragColor = vec4(light, t);
    }
`;

// ---------------------------------------------------------------------------
// Uniform types
// ---------------------------------------------------------------------------
export interface OceanSurfaceUniforms {
  _Time: Uniform<number>;
  _NormalMap1: Uniform<Texture | null>;
  _NormalMap2: Uniform<Texture | null>;
}

// ---------------------------------------------------------------------------
// Factory options
// ---------------------------------------------------------------------------
export interface CreateOceanSurfaceMaterialOptions {
  /** Shared sky uniforms (from createSkyMaterial). */
  skyUniforms: SkyShaderUniforms;
  /** First scrolling normal-map texture. */
  normalMap1?: Texture | null;
  /** Second scrolling normal-map texture. */
  normalMap2?: Texture | null;
  /** Shared time uniform — if not provided a new one is created starting at 0. */
  timeUniform?: Uniform<number>;
}

/**
 * Creates the ocean surface ShaderMaterial.
 *
 * The material is double-sided and transparent (the alpha channel drives
 * blending between reflection and underwater absorption).
 */
export function createOceanSurfaceMaterial(
  options: CreateOceanSurfaceMaterialOptions,
): ShaderMaterial {
  const uniforms: Record<string, Uniform> = {
    _Time: options.timeUniform ?? new Uniform(0),
    _NormalMap1: new Uniform(options.normalMap1 ?? null),
    _NormalMap2: new Uniform(options.normalMap2 ?? null),
  };

  const material = new ShaderMaterial({
    vertexShader: oceanSurfaceVertexShader,
    fragmentShader: oceanSurfaceFragmentShader,
    uniforms,
    side: DoubleSide,
    transparent: true,
  });

  setSkyboxUniforms(material, options.skyUniforms);

  return material;
}
