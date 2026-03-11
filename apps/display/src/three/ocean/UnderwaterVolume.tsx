import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import {
  BufferAttribute,
  BufferGeometry,
  Mesh,
  Uniform,
} from "three";
import { type SkyShaderUniforms } from "./shaders/SkyShaderMaterial";
import { createUnderwaterVolumeMaterial } from "./shaders/UnderwaterVolumeMaterial";

const HALF_SIZE = 1500;
const DEPTH = 1000;

export interface UnderwaterVolumeProps {
  skyUniforms: SkyShaderUniforms;
  timeUniform: Uniform<number>;
}

/* ------------------------------------------------------------------ */
/*  Geometry — open-top box below water surface                       */
/* ------------------------------------------------------------------ */
function createVolumeGeometry(): BufferGeometry {
  const hs = HALF_SIZE;
  const d = DEPTH;

  const vertices = new Float32Array([
    -hs, -d, -hs,
     hs, -d, -hs,
    -hs, -d,  hs,
     hs, -d,  hs,

    -hs, 0, -hs,
     hs, 0, -hs,
    -hs, 0,  hs,
     hs, 0,  hs,
  ]);

  const indices = [
    2, 3, 0, 3, 1, 0,
    0, 1, 4, 1, 5, 4,
    1, 3, 5, 3, 7, 5,
    3, 2, 7, 2, 6, 7,
    2, 0, 6, 0, 4, 6,
  ];

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  return geometry;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export function UnderwaterVolume({ skyUniforms, timeUniform }: UnderwaterVolumeProps) {
  const meshRef = useRef<Mesh>(null);

  const geometry = useMemo(() => createVolumeGeometry(), []);

  const material = useMemo(
    () =>
      createUnderwaterVolumeMaterial({
        skyUniforms,
        timeUniform,
      }),
    [skyUniforms, timeUniform]
  );

  useFrame(({ camera }) => {
    if (meshRef.current) {
      meshRef.current.position.set(camera.position.x, 0, camera.position.z);
    }
  });

  return <mesh ref={meshRef} geometry={geometry} material={material} />;
}
