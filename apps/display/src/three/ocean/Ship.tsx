import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Group, Box3, Vector3, Mesh, MeshStandardMaterial, SRGBColorSpace } from "three";
import type { Material, Texture } from "three";
import type { ShipNavigation } from "@token-raider/shared";

const MODEL_PATH = "/models/ship.glb";

/**
 * Desired ship size in world units (longest axis).
 * Tweak this to fit the ocean scene — the raw GLB may be
 * enormous or microscopic depending on its authoring units.
 */
const TARGET_SIZE = 30;

/**
 * Base Y-rotation to align the GLB model's forward axis with -Z (north).
 * The raw model faces -X, so we rotate -90° (-π/2) to point toward -Z.
 *
 * The server movement convention uses (sin(θ), 0, -cos(θ)) for direction,
 * but Three.js Y-rotation faces (-sin(θ), 0, -cos(θ)) — X is mirrored.
 * We compensate by negating rotationY when applying it to the world group.
 */
const MODEL_BASE_ROTATION_Y = -Math.PI / 2;

/** Rocking / bobbing animation parameters. */
const ROCK_SPEED = 0.6;
const ROCK_AMPLITUDE_X = 0.015;
const ROCK_AMPLITUDE_Z = 0.012;
const BOB_SPEED = 0.8;
const BOB_AMPLITUDE = 0.25;

/** Interpolation factor for smoothing server state. */
const LERP_FACTOR = 0.08;

/** Banking (roll) parameters — ship leans into turns. */
const BANK_FACTOR = 15;
const BANK_MAX = 0.15; // radians (~8.5°)
const BANK_SMOOTHING = 0.08;

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

export interface ShipProps {
  onWaterlineReady?: (info: WaterlineInfo) => void;
  navigation?: ShipNavigation;
  /** Callback reporting current world-space position each frame. */
  onPositionUpdate?: (x: number, z: number) => void;
}

/** Shortest-arc lerp for angles. */
function lerpAngle(from: number, to: number, t: number): number {
  let diff = ((to - from) % (Math.PI * 2) + Math.PI * 3) % (Math.PI * 2) - Math.PI;
  return from + diff * t;
}

export default function Ship({ onWaterlineReady, navigation, onPositionUpdate }: ShipProps) {
  /** Outer group — handles world-space position + heading rotation. */
  const worldGroupRef = useRef<Group>(null);
  /** Inner group — handles scale, y-offset, rocking, bobbing. */
  const modelGroupRef = useRef<Group>(null);
  const gltf = useGLTF(MODEL_PATH);

  /** Smoothed display-side values for position and rotation. */
  const displayState = useRef({ x: 0, z: 0, rotationY: 0 });
  /** Previous frame's rotationY for computing bank angle. */
  const prevRotRef = useRef(0);
  /** Smoothed bank (roll) angle. */
  const bankRef = useRef(0);

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

    const scaledHeight = size.y * s;
    const offset = -bbox.min.y * s - scaledHeight * 0.06;

    if (onWaterlineReady) {
      onWaterlineReady({
        halfBeamX: (size.x * s) / 2 * 0.6,
        halfLengthZ: (size.z * s) / 2 * 0.6,
        waterlineY: 0,
      });
    }

    return { scale: s, yOffset: offset };
  }, [gltf.scene, onWaterlineReady]);

  /* ---------------------------------------------------------------- */
  /*  Smoothly interpolate toward server state + rocking/bobbing       */
  /* ---------------------------------------------------------------- */
  useFrame(({ clock }) => {
    if (!worldGroupRef.current || !modelGroupRef.current) return;
    const t = clock.getElapsedTime();

    // Lerp display state toward server state
    const nav = navigation;
    if (nav) {
      displayState.current.x += (nav.x - displayState.current.x) * LERP_FACTOR;
      displayState.current.z += (nav.z - displayState.current.z) * LERP_FACTOR;
      displayState.current.rotationY = lerpAngle(
        displayState.current.rotationY,
        nav.rotationY,
        LERP_FACTOR,
      );
    }

    // World-space position + heading.
    // Negate rotationY: server uses (sin θ, -cos θ) but Three.js faces (-sin θ, -cos θ).
    worldGroupRef.current.position.x = displayState.current.x;
    worldGroupRef.current.position.z = displayState.current.z;
    worldGroupRef.current.rotation.y = -displayState.current.rotationY + MODEL_BASE_ROTATION_Y;

    // Banking: lean into turns based on rate of heading change.
    const curRot = displayState.current.rotationY;
    let deltaRot = curRot - prevRotRef.current;
    // Normalise to [-π, π]
    deltaRot = ((deltaRot + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
    prevRotRef.current = curRot;
    const targetBank = Math.max(-BANK_MAX, Math.min(BANK_MAX, -deltaRot * BANK_FACTOR));
    bankRef.current += (targetBank - bankRef.current) * BANK_SMOOTHING;
    worldGroupRef.current.rotation.z = bankRef.current;

    // Report position for camera tracking
    if (onPositionUpdate) {
      onPositionUpdate(displayState.current.x, displayState.current.z);
    }

    // Rocking and bobbing on the inner group
    modelGroupRef.current.rotation.x = Math.sin(t * ROCK_SPEED) * ROCK_AMPLITUDE_X;
    modelGroupRef.current.rotation.z =
      Math.sin(t * ROCK_SPEED * 0.7 + 1.2) * ROCK_AMPLITUDE_Z;
    modelGroupRef.current.position.y =
      yOffset + Math.sin(t * BOB_SPEED) * BOB_AMPLITUDE;
  });

  return (
    <group ref={worldGroupRef}>
      <group ref={modelGroupRef} scale={[scale, scale, scale]} position={[0, yOffset, 0]}>
        <primitive object={gltf.scene} />
      </group>
    </group>
  );
}

useGLTF.preload(MODEL_PATH);
