import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  Mesh,
  ShaderMaterial,
} from "three";
import type { ShipNavigation } from "@token-raider/shared";

/** Number of segments in the wake ribbon. */
const SEGMENT_COUNT = 60;

/** Width of the wake at the ship (narrowest). */
const WIDTH_NEAR = 2;

/** Width of the wake at the tail (widest). */
const WIDTH_FAR = 14;

/** Height above the ocean surface to avoid z-fighting. */
const WAKE_Y = 0.15;

/** Interpolation factor — matches Ship.tsx for consistent tracking. */
const LERP_FACTOR = 0.08;

/** How many frames between wake trail shifts (controls trail length). */
const SHIFT_INTERVAL = 2;

const vertexShader = /* glsl */ `
  attribute float aAlpha;
  varying float vAlpha;

  void main() {
    vAlpha = aAlpha;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  varying float vAlpha;
  uniform vec3 uColor;

  void main() {
    gl_FragColor = vec4(uColor, vAlpha * 0.45);
  }
`;

/** Shortest-arc lerp for angles. */
function lerpAngle(from: number, to: number, t: number): number {
  let diff = ((to - from) % (Math.PI * 2) + Math.PI * 3) % (Math.PI * 2) - Math.PI;
  return from + diff * t;
}

export interface WakeTrailProps {
  navigation?: ShipNavigation;
}

/**
 * V-shaped wake trail ribbon behind the ship.
 *
 * Uses a quad-strip geometry that shifts backward each frame,
 * with the newest segment placed at the ship's interpolated position.
 * Width widens and opacity fades toward the tail.
 */
export function WakeTrail({ navigation }: WakeTrailProps) {
  const meshRef = useRef<Mesh>(null);
  const frameCount = useRef(0);

  /** Smoothed display state — independent from Ship.tsx to avoid coupling. */
  const displayState = useRef({ x: 0, z: 0, rotationY: 0 });

  const VERT_COUNT = (SEGMENT_COUNT + 1) * 2;

  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(VERT_COUNT * 3);
    const alphas = new Float32Array(VERT_COUNT);

    // Initialise all vertices at origin
    for (let i = 0; i < VERT_COUNT; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = WAKE_Y;
      positions[i * 3 + 2] = 0;
      alphas[i] = 0;
    }

    // Build triangle index buffer for quad strip
    const indices: number[] = [];
    for (let i = 0; i < SEGMENT_COUNT; i++) {
      const bl = i * 2;
      const br = i * 2 + 1;
      const tl = (i + 1) * 2;
      const tr = (i + 1) * 2 + 1;
      indices.push(bl, tl, br);
      indices.push(br, tl, tr);
    }

    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(positions, 3));
    geo.setAttribute("aAlpha", new BufferAttribute(alphas, 1));
    geo.setIndex(indices);

    const mat = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uColor: { value: [0.9, 0.95, 1.0] },
      },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      side: DoubleSide,
    });

    return { geometry: geo, material: mat };
  }, []);

  useFrame(() => {
    if (!navigation) return;

    // Lerp toward server state
    const ds = displayState.current;
    ds.x += (navigation.x - ds.x) * LERP_FACTOR;
    ds.z += (navigation.z - ds.z) * LERP_FACTOR;
    ds.rotationY = lerpAngle(ds.rotationY, navigation.rotationY, LERP_FACTOR);

    frameCount.current++;
    if (frameCount.current % SHIFT_INTERVAL !== 0) return;

    const posAttr = geometry.getAttribute("position") as BufferAttribute;
    const alphaAttr = geometry.getAttribute("aAlpha") as BufferAttribute;
    const positions = posAttr.array as Float32Array;
    const alphas = alphaAttr.array as Float32Array;

    // Shift all segments backward by one (oldest segment falls off)
    // Segment 0 is the tail (oldest), segment SEGMENT_COUNT is the ship (newest)
    for (let i = 0; i < SEGMENT_COUNT; i++) {
      const srcL = (i + 1) * 2;
      const srcR = (i + 1) * 2 + 1;
      const dstL = i * 2;
      const dstR = i * 2 + 1;
      // Copy positions
      positions[dstL * 3] = positions[srcL * 3];
      positions[dstL * 3 + 1] = positions[srcL * 3 + 1];
      positions[dstL * 3 + 2] = positions[srcL * 3 + 2];
      positions[dstR * 3] = positions[srcR * 3];
      positions[dstR * 3 + 1] = positions[srcR * 3 + 1];
      positions[dstR * 3 + 2] = positions[srcR * 3 + 2];
      // Copy alphas
      alphas[dstL] = alphas[srcL];
      alphas[dstR] = alphas[srcR];
    }

    // Place newest segment at ship position
    const shipX = ds.x;
    const shipZ = ds.z;
    const rot = ds.rotationY;

    // Speed-dependent wake: collapse when stopped
    const speedRatio = Math.min(1, navigation.speed / 6);

    // Perpendicular direction (90° from heading)
    const perpX = Math.cos(rot);
    const perpZ = Math.sin(rot);

    // Behind the ship: offset slightly backward from centre
    const behindDist = 4 * speedRatio;
    const backX = shipX - Math.sin(rot) * behindDist;
    const backZ = shipZ + Math.cos(rot) * behindDist;

    // Newest segment (index = SEGMENT_COUNT) — narrow at ship
    const newestIdx = SEGMENT_COUNT;
    const nearHalfW = (WIDTH_NEAR / 2) * speedRatio;
    const leftIdx = newestIdx * 2;
    const rightIdx = newestIdx * 2 + 1;

    positions[leftIdx * 3] = backX - perpX * nearHalfW;
    positions[leftIdx * 3 + 1] = WAKE_Y;
    positions[leftIdx * 3 + 2] = backZ - perpZ * nearHalfW;

    positions[rightIdx * 3] = backX + perpX * nearHalfW;
    positions[rightIdx * 3 + 1] = WAKE_Y;
    positions[rightIdx * 3 + 2] = backZ + perpZ * nearHalfW;

    alphas[leftIdx] = speedRatio;
    alphas[rightIdx] = speedRatio;

    // Update alpha for all segments: fade from 1 at ship to 0 at tail
    // Also widen older segments
    for (let i = 0; i <= SEGMENT_COUNT; i++) {
      const t = i / SEGMENT_COUNT; // 0 = tail, 1 = ship
      const fadeAlpha = t * t * speedRatio; // quadratic falloff
      alphas[i * 2] = Math.min(alphas[i * 2], fadeAlpha);
      alphas[i * 2 + 1] = Math.min(alphas[i * 2 + 1], fadeAlpha);
    }

    posAttr.needsUpdate = true;
    alphaAttr.needsUpdate = true;
  });

  return <mesh ref={meshRef} geometry={geometry} material={material} frustumCulled={false} />;
}
