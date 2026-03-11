/**
 * Underwater volume shader material — ported from Three.js-Ocean-Scene
 *
 * Renders the underwater fog/absorption volume. The camera can be above or
 * below the water surface; the shader adjusts the absorption ray accordingly.
 */
import {
  ShaderMaterial,
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
export const underwaterVolumeVertexShader = /* glsl */ `
    varying vec3 _worldPos;

    void main()
    {
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        _worldPos = worldPos.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
`;

// ---------------------------------------------------------------------------
// Fragment shader
// ---------------------------------------------------------------------------
export const underwaterVolumeFragmentShader = /* glsl */ `
    ${SHADER_CHUNK_OCEAN}

    varying vec3 _worldPos;

    void main()
    {
        vec3 viewVec = _worldPos - cameraPosition;
        float viewLen = length(viewVec);
        vec3 viewDir = viewVec / viewLen;
        float originY = cameraPosition.y;

        if (cameraPosition.y > 0.0)
        {
            float distAbove = cameraPosition.y / -viewDir.y;
            viewLen -= distAbove;
            originY = 0.0;
        }
        viewLen = min(viewLen, MAX_VIEW_DEPTH);

        float sampleY = originY + viewDir.y * viewLen;
        vec3 light = exp((sampleY - viewLen * DENSITY) * ABSORPTION);
        light *= _Light;

        gl_FragColor = vec4(light, 1.0);
    }
`;

// ---------------------------------------------------------------------------
// Factory options
// ---------------------------------------------------------------------------
export interface CreateUnderwaterVolumeMaterialOptions {
  /** Shared sky uniforms (from createSkyMaterial). */
  skyUniforms: SkyShaderUniforms;
  /** Shared time uniform — the volume fragment needs _Time via the ocean chunk. */
  timeUniform?: Uniform<number>;
}

/**
 * Creates the underwater volume ShaderMaterial.
 *
 * This material is rendered on geometry that encompasses the underwater area
 * and produces the distance-based colour absorption fog.
 */
export function createUnderwaterVolumeMaterial(
  options: CreateUnderwaterVolumeMaterialOptions,
): ShaderMaterial {
  const uniforms: Record<string, Uniform> = {
    // The ocean chunk declares _Time, _NormalMap1, _NormalMap2 as uniforms.
    // The volume shader doesn't sample the normal maps but the uniforms must
    // still exist so the GLSL compiler doesn't complain about missing bindings.
    _Time: options.timeUniform ?? new Uniform(0),
    _NormalMap1: new Uniform(null),
    _NormalMap2: new Uniform(null),
  };

  const material = new ShaderMaterial({
    vertexShader: underwaterVolumeVertexShader,
    fragmentShader: underwaterVolumeFragmentShader,
    uniforms,
  });

  setSkyboxUniforms(material, options.skyUniforms);

  return material;
}
