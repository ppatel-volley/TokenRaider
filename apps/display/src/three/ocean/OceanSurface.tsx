import { useRef, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import {
  BufferAttribute,
  BufferGeometry,
  Mesh,
  RepeatWrapping,
  ShaderMaterial,
  TextureLoader,
  Uniform,
} from "three";
import { type SkyShaderUniforms } from "./shaders/SkyShaderMaterial";
import { createOceanSurfaceMaterial } from "./shaders/OceanShaderMaterial";

const HALF_SIZE = 1500;

export interface OceanSurfaceProps {
  skyUniforms: SkyShaderUniforms;
  timeUniform: Uniform<number>;
}

/* ------------------------------------------------------------------ */
/*  Geometry                                                           */
/* ------------------------------------------------------------------ */
function createSurfaceGeometry(): BufferGeometry {
  const hs = HALF_SIZE;
  const vertices = new Float32Array([
    -hs, 0, -hs,
     hs, 0, -hs,
    -hs, 0,  hs,
     hs, 0,  hs,
  ]);

  const indices = [2, 3, 0, 3, 1, 0];

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  return geometry;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export function OceanSurface({ skyUniforms, timeUniform }: OceanSurfaceProps) {
  const meshRef = useRef<Mesh>(null);

  const [normalTex1, normalTex2] = useLoader(TextureLoader, [
    "/textures/ocean/waterNormal1.png",
    "/textures/ocean/waterNormal2.png",
  ]);

  useMemo(() => {
    normalTex1.wrapS = RepeatWrapping;
    normalTex1.wrapT = RepeatWrapping;
    normalTex2.wrapS = RepeatWrapping;
    normalTex2.wrapT = RepeatWrapping;
  }, [normalTex1, normalTex2]);

  const geometry = useMemo(() => createSurfaceGeometry(), []);

  const material = useMemo(
    () =>
      createOceanSurfaceMaterial({
        skyUniforms,
        normalMap1: normalTex1,
        normalMap2: normalTex2,
        timeUniform,
      }),
    [skyUniforms, normalTex1, normalTex2, timeUniform]
  );

  useFrame(({ camera }) => {
    if (meshRef.current) {
      meshRef.current.position.set(camera.position.x, 0, camera.position.z);
    }
  });

  return <mesh ref={meshRef} geometry={geometry} material={material} />;
}
