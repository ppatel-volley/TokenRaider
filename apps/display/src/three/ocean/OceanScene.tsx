import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Euler, Matrix3, Uniform, Vector3 } from "three";
import type { SkyState } from "./shaders/SkyShaderMaterial";
import { Skybox } from "./Skybox";
import { OceanSurface } from "./OceanSurface";
import { UnderwaterVolume } from "./UnderwaterVolume";
import { SeaFloor } from "./SeaFloor";
import Ship from "./Ship";
import type { WaterlineInfo } from "./Ship";
import { WaterParticles } from "./WaterParticles";

/* ------------------------------------------------------------------ */
/*  WASD + mouse-look FPS camera controller                           */
/* ------------------------------------------------------------------ */

const MOVE_SPEED = 30;
const MOUSE_SENSITIVITY = 0.002;

function useFPSCamera() {
  const { camera, gl } = useThree();
  const keys = useRef<Set<string>>(new Set());
  const euler = useRef(new Euler(0, 0, 0, "YXZ"));
  const velocity = useRef(new Vector3());

  // Initialise camera position: near the ship, slightly elevated.
  useMemo(() => {
    camera.near = 0.1;
    camera.far = 5000;
    camera.position.set(30, 8, 30);
    camera.lookAt(0, 3, 0);
    euler.current.setFromQuaternion(camera.quaternion, "YXZ");
    camera.updateProjectionMatrix();
  }, [camera]);

  // Keyboard listeners.
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => keys.current.add(e.code);
    const onUp = (e: KeyboardEvent) => keys.current.delete(e.code);
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, []);

  // Pointer lock for mouse look.
  useEffect(() => {
    const canvas = gl.domElement;
    const onClick = () => canvas.requestPointerLock();
    canvas.addEventListener("click", onClick);

    const onMove = (e: MouseEvent) => {
      if (document.pointerLockElement !== canvas) return;
      euler.current.y -= e.movementX * MOUSE_SENSITIVITY;
      euler.current.x -= e.movementY * MOUSE_SENSITIVITY;
      // Clamp pitch to avoid flipping.
      euler.current.x = Math.max(-Math.PI / 2 + 0.01, Math.min(Math.PI / 2 - 0.01, euler.current.x));
    };
    document.addEventListener("mousemove", onMove);

    return () => {
      canvas.removeEventListener("click", onClick);
      document.removeEventListener("mousemove", onMove);
    };
  }, [gl]);

  // Movement each frame.
  useFrame((_, delta) => {
    const k = keys.current;
    const forward = new Vector3(0, 0, -1).applyEuler(euler.current);
    const right = new Vector3(1, 0, 0).applyEuler(euler.current);

    velocity.current.set(0, 0, 0);
    if (k.has("KeyW")) velocity.current.add(forward);
    if (k.has("KeyS")) velocity.current.sub(forward);
    if (k.has("KeyD")) velocity.current.add(right);
    if (k.has("KeyA")) velocity.current.sub(right);
    if (k.has("Space")) velocity.current.y += 1;
    if (k.has("ShiftLeft") || k.has("ShiftRight")) velocity.current.y -= 1;

    if (velocity.current.lengthSq() > 0) {
      velocity.current.normalize().multiplyScalar(MOVE_SPEED * delta);
      camera.position.add(velocity.current);
    }

    camera.quaternion.setFromEuler(euler.current);
  });
}

/* ------------------------------------------------------------------ */
/*  OceanScene                                                        */
/* ------------------------------------------------------------------ */

/**
 * Self-contained ocean environment scene.
 *
 * Drop this into any R3F Canvas and it renders the full underwater /
 * ocean-surface / sky environment ported from the vanilla Three.js
 * ocean demo, with a ship model as the cinematic focal point.
 *
 * WASD + mouse look camera in dev mode. Click canvas to capture mouse.
 */
export function OceanScene() {
  const dirToLight = useMemo(() => new Vector3(0, 1, 0), []);
  const rotationMatrix = useMemo(() => new Matrix3(), []);
  const cameraForward = useMemo(() => new Vector3(0, 0, -1), []);
  const timeUniform = useMemo(() => new Uniform(0), []);

  const [skyState, setSkyState] = useState<SkyState | null>(null);
  const [waterline, setWaterline] = useState<WaterlineInfo | null>(null);

  const onSkyStateReady = useCallback((state: SkyState) => {
    setSkyState(state);
  }, []);

  const onWaterlineReady = useCallback((info: WaterlineInfo) => {
    setWaterline(info);
  }, []);

  const { camera } = useThree();
  const timeRef = useRef(0);

  // FPS camera controller (WASD + mouse look).
  useFPSCamera();

  // Advance shared time uniform and keep cameraForward in sync.
  useFrame((_, delta) => {
    timeRef.current += delta;
    timeUniform.value = timeRef.current;
    camera.getWorldDirection(cameraForward);
  });

  return (
    <Suspense fallback={null}>
      <Skybox
        dirToLight={dirToLight}
        rotationMatrix={rotationMatrix}
        onSkyStateReady={onSkyStateReady}
      />
      {skyState && (
        <>
          <OceanSurface
            skyUniforms={skyState.uniforms}
            timeUniform={timeUniform}
          />
          <UnderwaterVolume
            skyUniforms={skyState.uniforms}
            timeUniform={timeUniform}
          />
          <SeaFloor
            skyUniforms={skyState.uniforms}
            timeUniform={timeUniform}
            cameraForward={cameraForward}
          />
        </>
      )}
      {/* Scene lights for PBR materials (ship model) */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[100, 80, 50]}
        intensity={1.2}
        color="#fffbe8"
      />
      <hemisphereLight
        args={["#87ceeb", "#1e3a5f", 0.5]}
      />
      {waterline && (
        <WaterParticles
          semiX={waterline.halfBeamX}
          semiZ={waterline.halfLengthZ}
          waterlineY={waterline.waterlineY}
        />
      )}
      <Ship onWaterlineReady={onWaterlineReady} />
    </Suspense>
  );
}
