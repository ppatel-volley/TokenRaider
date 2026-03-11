import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Group, Box3, Vector3, Mesh, MeshStandardMaterial, SRGBColorSpace } from "three";
import type { Material, Texture } from "three";

const MODEL_PATH = "/models/ship.glb";

/**
 * Desired ship size in world units (longest axis).
 * Tweak this to fit the ocean scene — the raw GLB may be
 * enormous or microscopic depending on its authoring units.
 */
const TARGET_SIZE = 30;

/** Rocking / bobbing animation parameters. */
const ROCK_SPEED = 0.6;
const ROCK_AMPLITUDE_X = 0.015;
const ROCK_AMPLITUDE_Z = 0.012;
const BOB_SPEED = 0.8;
const BOB_AMPLITUDE = 0.25;

/** Ensure all textures on a material use sRGB and have proper encoding. */
function fixMaterialTextures(mat: Material) {
  if (!(mat instanceof MeshStandardMaterial)) return;
  const texProps: (keyof MeshStandardMaterial)[] = [
    "map", "emissiveMap", "normalMap", "roughnessMap", "metalnessMap", "aoMap",
  ];
  for (const prop of texProps) {
    const tex = mat[prop] as Texture | null;
    if (tex) {
      if (prop === "map" || prop === "emissiveMap") {
        tex.colorSpace = SRGBColorSpace;
      }
      tex.needsUpdate = true;
    }
  }
}

/** Hull waterline info computed from the model, for use by particles etc. */
export interface WaterlineInfo {
  /** Half-extent of the hull along X at the waterline. */
  halfBeamX: number;
  /** Half-extent of the hull along Z at the waterline. */
  halfLengthZ: number;
  /** Y position of the waterline in world space. */
  waterlineY: number;
}

export default function Ship({ onWaterlineReady }: { onWaterlineReady?: (info: WaterlineInfo) => void }) {
  const groupRef = useRef<Group>(null);
  const gltf = useGLTF(MODEL_PATH);

  /* ---------------------------------------------------------------- */
  /*  Fix textures: ensure sRGB encoding on colour maps                */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    gltf.scene.traverse((child) => {
      if (child instanceof Mesh) {
        if (Array.isArray(child.material)) {
          child.material.forEach(fixMaterialTextures);
        } else {
          fixMaterialTextures(child.material);
        }
      }
    });
  }, [gltf.scene]);

  /* ---------------------------------------------------------------- */
  /*  Compute scale + vertical offset so ship sits ON the water        */
  /* ---------------------------------------------------------------- */
  const { scale, yOffset } = useMemo(() => {
    const bbox = new Box3().setFromObject(gltf.scene);
    const size = new Vector3();
    bbox.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const s = maxDim > 0 ? TARGET_SIZE / maxDim : 1;

    // After scaling, sink the hull into the water a bit so it looks natural.
    // bbox.min.y * s gives us the scaled bottom — negate it to push the ship up,
    // then subtract a fraction of the hull height to submerge it.
    const scaledHeight = size.y * s;
    const offset = -bbox.min.y * s - scaledHeight * 0.06;

    // Report the waterline ellipse to the parent so particles can use it.
    if (onWaterlineReady) {
      // Scale down to ~60% of bounding box — the bbox includes rigging,
      // bowsprit, etc. which extend well beyond the actual hull.
      onWaterlineReady({
        halfBeamX: (size.x * s) / 2 * 0.6,
        halfLengthZ: (size.z * s) / 2 * 0.6,
        waterlineY: 0,
      });
    }

    return { scale: s, yOffset: offset };
  }, [gltf.scene, onWaterlineReady]);

  /* ---------------------------------------------------------------- */
  /*  Gentle rocking + bobbing each frame                              */
  /* ---------------------------------------------------------------- */
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    // Slight roll and pitch to simulate waves.
    groupRef.current.rotation.x = Math.sin(t * ROCK_SPEED) * ROCK_AMPLITUDE_X;
    groupRef.current.rotation.z =
      Math.sin(t * ROCK_SPEED * 0.7 + 1.2) * ROCK_AMPLITUDE_Z;

    // Vertical bob around the waterline offset.
    groupRef.current.position.y =
      yOffset + Math.sin(t * BOB_SPEED) * BOB_AMPLITUDE;
  });

  return (
    <group ref={groupRef} scale={[scale, scale, scale]} position={[0, yOffset, 0]}>
      <primitive object={gltf.scene} />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);
