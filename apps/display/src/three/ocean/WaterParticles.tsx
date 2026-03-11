import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Points,
  ShaderMaterial,
} from "three";

/** Default fallback ellipse if no waterline info provided. */
const DEFAULT_SEMI_X = 3;
const DEFAULT_SEMI_Z = 9;

const PARTICLE_COUNT = 300;
const MAX_LIFETIME = 2.5; // seconds

/** Gravity applied to vertical velocity each second. */
const GRAVITY = -1.2;

/** Maximum initial upward speed for a spray particle. */
const MAX_RISE_SPEED = 1.0;
const MIN_RISE_SPEED = 0.2;

/** Outward horizontal push from the hull. */
const MAX_OUTWARD_SPEED = 0.3;

/** Small random horizontal drift. */
const MAX_DRIFT = 0.1;

const vertexShader = /* glsl */ `
  attribute float aOpacity;
  attribute float aSize;
  varying float vOpacity;

  void main() {
    vOpacity = aOpacity;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (200.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  varying float vOpacity;
  uniform vec3 uColor;

  void main() {
    // Soft circular particle with faded edge.
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    float alpha = smoothstep(0.5, 0.15, dist) * vOpacity;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

interface ParticleState {
  /** Velocity components per particle (vx, vy, vz). */
  velocities: Float32Array;
  /** Remaining lifetime per particle. */
  lifetimes: Float32Array;
  /** Total lifetime per particle (used to compute normalised age). */
  maxLifetimes: Float32Array;
}

/** Spawn a single particle at a random point on the waterline ellipse. */
function spawnParticle(
  index: number,
  positions: Float32Array,
  velocities: Float32Array,
  lifetimes: Float32Array,
  maxLifetimes: Float32Array,
  opacities: Float32Array,
  sizes: Float32Array,
  semiX: number,
  semiZ: number,
  waterlineY: number,
) {
  // Random angle around the ellipse.
  const theta = Math.random() * Math.PI * 2;
  // Slight inward/outward jitter so they don't all sit on the exact perimeter.
  const jitter = 1.0 + (Math.random() - 0.5) * 0.25;
  const x = Math.cos(theta) * semiX * jitter;
  const z = Math.sin(theta) * semiZ * jitter;
  // Spawn right at the waterline with tiny vertical scatter.
  const y = waterlineY + (Math.random() - 0.3) * 0.4;

  const i3 = index * 3;
  positions[i3] = x;
  positions[i3 + 1] = y;
  positions[i3 + 2] = z;

  // Outward direction from the hull centre (normalised on XZ plane).
  const len = Math.sqrt(x * x + z * z) || 1;
  const nx = x / len;
  const nz = z / len;

  const outwardSpeed = Math.random() * MAX_OUTWARD_SPEED;
  velocities[i3] = nx * outwardSpeed + (Math.random() - 0.5) * MAX_DRIFT;
  velocities[i3 + 1] = MIN_RISE_SPEED + Math.random() * (MAX_RISE_SPEED - MIN_RISE_SPEED);
  velocities[i3 + 2] = nz * outwardSpeed + (Math.random() - 0.5) * MAX_DRIFT;

  const life = 1.5 + Math.random() * (MAX_LIFETIME - 1.5);
  lifetimes[index] = life;
  maxLifetimes[index] = life;

  opacities[index] = 1.0;
  sizes[index] = 0.8 + Math.random() * 1.2;
}

/**
 * Gentle water-spray particles around the ship's waterline.
 *
 * Uses a recycled particle pool rendered via Three.js Points with a
 * custom shader for per-particle opacity and soft circular sprites.
 */
export interface WaterParticlesProps {
  semiX?: number;
  semiZ?: number;
  waterlineY?: number;
}

export function WaterParticles({
  semiX = DEFAULT_SEMI_X,
  semiZ = DEFAULT_SEMI_Z,
  waterlineY = 0,
}: WaterParticlesProps) {
  const pointsRef = useRef<Points>(null);
  const ellipseRef = useRef({ semiX, semiZ, waterlineY });
  ellipseRef.current = { semiX, semiZ, waterlineY };

  const { geometry, material, state } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const opacities = new Float32Array(PARTICLE_COUNT);
    const particleSizes = new Float32Array(PARTICLE_COUNT);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    const lifetimes = new Float32Array(PARTICLE_COUNT);
    const maxLifetimes = new Float32Array(PARTICLE_COUNT);

    // Initialise all particles with staggered lifetimes so they don't all
    // spawn on the first frame.
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      spawnParticle(i, positions, velocities, lifetimes, maxLifetimes, opacities, particleSizes, semiX, semiZ, waterlineY);
      // Stagger: pretend some have already been alive for a random portion.
      const preAge = Math.random() * maxLifetimes[i];
      lifetimes[i] -= preAge;
    }

    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(positions, 3));
    geo.setAttribute("aOpacity", new BufferAttribute(opacities, 1));
    geo.setAttribute("aSize", new BufferAttribute(particleSizes, 1));

    const mat = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uColor: { value: new Color(0.85, 0.92, 1.0) },
      },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    });

    const particleState: ParticleState = { velocities, lifetimes, maxLifetimes };
    return { geometry: geo, material: mat, state: particleState };
  }, []);

  useFrame((_, delta) => {
    // Clamp delta to avoid huge jumps on tab-refocus.
    const dt = Math.min(delta, 0.1);

    const posAttr = geometry.getAttribute("position") as BufferAttribute;
    const opacityAttr = geometry.getAttribute("aOpacity") as BufferAttribute;
    const sizeAttr = geometry.getAttribute("aSize") as BufferAttribute;
    const positions = posAttr.array as Float32Array;
    const opacities = opacityAttr.array as Float32Array;
    const sizes = sizeAttr.array as Float32Array;
    const { velocities, lifetimes, maxLifetimes } = state;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      lifetimes[i] -= dt;

      if (lifetimes[i] <= 0) {
        // Recycle expired particle using current ellipse dimensions.
        const e = ellipseRef.current;
        spawnParticle(i, positions, velocities, lifetimes, maxLifetimes, opacities, sizes, e.semiX, e.semiZ, e.waterlineY);
        continue;
      }

      const i3 = i * 3;

      // Apply gravity to vertical velocity.
      velocities[i3 + 1] += GRAVITY * dt;

      // Integrate position.
      positions[i3] += velocities[i3] * dt;
      positions[i3 + 1] += velocities[i3 + 1] * dt;
      positions[i3 + 2] += velocities[i3 + 2] * dt;

      // Don't let particles sink below the waterline.
      if (positions[i3 + 1] < -0.1) {
        positions[i3 + 1] = -0.1;
        velocities[i3 + 1] = 0;
      }

      // Fade out over the last 40% of lifetime.
      const ageRatio = lifetimes[i] / maxLifetimes[i];
      opacities[i] = Math.min(1.0, ageRatio / 0.4);
    }

    posAttr.needsUpdate = true;
    opacityAttr.needsUpdate = true;
    sizeAttr.needsUpdate = true;
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}
