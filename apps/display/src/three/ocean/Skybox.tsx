import { useRef, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import {
  BufferAttribute,
  BufferGeometry,
  MathUtils,
  Matrix3,
  Mesh,
  RepeatWrapping,
  TextureLoader,
  Vector3,
} from "three";
import {
  createSkyMaterial,
  type SkyState,
} from "./shaders/SkyShaderMaterial";

/**
 * Props forwarded from OceanScene so siblings can share the sky state.
 */
export interface SkyboxProps {
  /** Mutated each frame — the direction toward the sun. */
  dirToLight: Vector3;
  /** Mutated each frame — the 3x3 sky rotation matrix. */
  rotationMatrix: Matrix3;
  /** Called once on mount with the SkyState so siblings can wire up uniforms. */
  onSkyStateReady: (state: SkyState) => void;
}

/* ------------------------------------------------------------------ */
/*  Constants matching the original vanilla scene                     */
/* ------------------------------------------------------------------ */
const HALF_SIZE = 2000;
const SPEED = 0.05;
const INITIAL = new Vector3(0, 1, 0);
const AXIS = new Vector3(0, 0, 1).applyAxisAngle(
  new Vector3(0, 1, 0),
  MathUtils.degToRad(-30)
);
const INITIAL_ANGLE = -1;

/* ------------------------------------------------------------------ */
/*  Geometry                                                           */
/* ------------------------------------------------------------------ */
function createSkyboxGeometry(): BufferGeometry {
  const hs = HALF_SIZE;
  const vertices = new Float32Array([
    -hs, -hs, -hs,
     hs, -hs, -hs,
    -hs, -hs,  hs,
     hs, -hs,  hs,
    -hs,  hs, -hs,
     hs,  hs, -hs,
    -hs,  hs,  hs,
     hs,  hs,  hs,
  ]);

  const indices = [
    2, 3, 0, 3, 1, 0,
    0, 1, 4, 1, 5, 4,
    1, 3, 5, 3, 7, 5,
    3, 2, 7, 2, 6, 7,
    2, 0, 6, 0, 4, 6,
    4, 5, 6, 5, 7, 6,
  ];

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(vertices, 3));
  geometry.setAttribute("coord", new BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  return geometry;
}

/* ------------------------------------------------------------------ */
/*  Rotation matrix helper                                             */
/* ------------------------------------------------------------------ */
function computeRotationMatrix(angle: number, out: Matrix3): void {
  const cos = Math.cos(angle);
  const cos1 = 1 - cos;
  const sin = Math.sin(angle);
  const u = AXIS;
  const u2x = u.x * u.x;
  const u2y = u.y * u.y;
  const u2z = u.z * u.z;

  out.set(
    cos + u2x * cos1,              u.x * u.y * cos1 - u.z * sin,  u.x * u.z * cos1 + u.y * sin,
    u.y * u.x * cos1 + u.z * sin,  cos + u2y * cos1,              u.y * u.z * cos1 - u.x * sin,
    u.z * u.x * cos1 - u.y * sin,  u.z * u.y * cos1 + u.x * sin, cos + u2z * cos1
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export function Skybox({ dirToLight, rotationMatrix, onSkyStateReady }: SkyboxProps) {
  const meshRef = useRef<Mesh>(null);
  const angleRef = useRef(INITIAL_ANGLE);

  // Load the blue-noise dither texture used by the sky shader.
  const ditherTexture = useLoader(TextureLoader, "/textures/ocean/bluenoise.png");
  useMemo(() => {
    ditherTexture.wrapS = RepeatWrapping;
    ditherTexture.wrapT = RepeatWrapping;
  }, [ditherTexture]);

  const geometry = useMemo(() => createSkyboxGeometry(), []);

  // Create the sky material and expose the SkyState to the parent.
  const { material, skyState } = useMemo(() => {
    const { material: mat, state } = createSkyMaterial({
      ditherTexture,
      ditherTextureSize: ditherTexture.image
        ? { x: ditherTexture.image.width, y: ditherTexture.image.height } as any
        : undefined,
      dirToLight,
      skyRotationMatrix: rotationMatrix,
    });

    // Initialise light direction from the starting angle.
    computeRotationMatrix(angleRef.current, rotationMatrix);
    const tmp = INITIAL.clone().applyMatrix3(rotationMatrix);
    dirToLight.set(-tmp.x, tmp.y, -tmp.z);
    state.update();

    onSkyStateReady(state);

    return { material: mat, skyState: state };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ditherTexture]);

  useFrame(({ camera }, delta) => {
    // Advance angle.
    angleRef.current += delta * SPEED;
    computeRotationMatrix(angleRef.current, rotationMatrix);

    // Derive light direction from the rotated initial vector.
    const tmp = INITIAL.clone().applyMatrix3(rotationMatrix);
    dirToLight.set(-tmp.x, tmp.y, -tmp.z);

    // Update sun/twilight visibility uniforms.
    skyState.update();

    // Skybox follows camera.
    if (meshRef.current) {
      meshRef.current.position.copy(camera.position);
    }
  });

  return <mesh ref={meshRef} geometry={geometry} material={material} />;
}
