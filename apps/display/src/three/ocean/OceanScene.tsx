import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Matrix3, Uniform, Vector3 } from "three";
import type { SkyState } from "./shaders/SkyShaderMaterial";
import { Skybox } from "./Skybox";
import { OceanSurface } from "./OceanSurface";
import { UnderwaterVolume } from "./UnderwaterVolume";
import { SeaFloor } from "./SeaFloor";
import Ship from "./Ship";
import type { WaterlineInfo } from "./Ship";
import { WaterParticles } from "./WaterParticles";
import { WakeTrail } from "./WakeTrail";
import { TreasureChestField } from "./TreasureChestField";
import { AbandonShipBoat } from "./AbandonShipBoat";
import type { ShipNavigation, TreasureChest, CrewMember } from "@token-raider/shared";

/* ------------------------------------------------------------------ */
/*  Fixed isometric camera that tracks the ship position               */
/* ------------------------------------------------------------------ */

/** Camera offset from the ship — south of the ship looking north. */
const CAMERA_OFFSET = new Vector3(0, 50, 80);
const CAMERA_LERP = 0.06;

function useIsometricCamera(shipPosRef: React.MutableRefObject<{ x: number; z: number }>) {
  const { camera } = useThree();
  const initialized = useRef(false);

  useMemo(() => {
    camera.near = 0.1;
    camera.far = 5000;
    camera.updateProjectionMatrix();
  }, [camera]);

  useFrame(() => {
    const target = shipPosRef.current;

    if (!initialized.current) {
      // Snap on first frame
      camera.position.set(
        target.x + CAMERA_OFFSET.x,
        CAMERA_OFFSET.y,
        target.z + CAMERA_OFFSET.z,
      );
      camera.lookAt(target.x, 0, target.z);
      initialized.current = true;
      return;
    }

    // Smoothly follow the ship position, fixed orientation
    const desiredX = target.x + CAMERA_OFFSET.x;
    const desiredZ = target.z + CAMERA_OFFSET.z;

    camera.position.x += (desiredX - camera.position.x) * CAMERA_LERP;
    camera.position.y += (CAMERA_OFFSET.y - camera.position.y) * CAMERA_LERP;
    camera.position.z += (desiredZ - camera.position.z) * CAMERA_LERP;

    camera.lookAt(target.x, 0, target.z);
  });
}

/* ------------------------------------------------------------------ */
/*  OceanScene                                                        */
/* ------------------------------------------------------------------ */

interface AbandonBoatEntry {
  id: string;
  startX: number;
  startZ: number;
  directionAngle: number;
}

export interface OceanSceneProps {
  navigation?: ShipNavigation;
  treasureChests?: TreasureChest[];
  crew?: CrewMember[];
}

/**
 * Self-contained ocean environment scene.
 *
 * Drop this into any R3F Canvas and it renders the full underwater /
 * ocean-surface / sky environment with a ship model as the focal point.
 *
 * Fixed isometric camera tracks the ship as it sails.
 */
export function OceanScene({ navigation, treasureChests = [], crew = [] }: OceanSceneProps) {
  const dirToLight = useMemo(() => new Vector3(0, 1, 0), []);
  const rotationMatrix = useMemo(() => new Matrix3(), []);
  const cameraForward = useMemo(() => new Vector3(0, 0, -1), []);
  const timeUniform = useMemo(() => new Uniform(0), []);

  const [skyState, setSkyState] = useState<SkyState | null>(null);
  const [waterline, setWaterline] = useState<WaterlineInfo | null>(null);

  /** Mutable ref for current ship world-space position (updated by Ship). */
  const shipPosRef = useRef({ x: 0, z: 0 });

  const onSkyStateReady = useCallback((state: SkyState) => {
    setSkyState(state);
  }, []);

  const onWaterlineReady = useCallback((info: WaterlineInfo) => {
    setWaterline(info);
  }, []);

  const onShipPositionUpdate = useCallback((x: number, z: number) => {
    shipPosRef.current.x = x;
    shipPosRef.current.z = z;
  }, []);

  const { camera } = useThree();
  const timeRef = useRef(0);

  // Fixed isometric camera following the ship.
  useIsometricCamera(shipPosRef);

  // Advance shared time uniform and keep cameraForward in sync.
  useFrame((_, delta) => {
    timeRef.current += delta;
    timeUniform.value = timeRef.current;
    camera.getWorldDirection(cameraForward);
  });

  /* ---- Abandon-ship animation queue ---- */
  const [abandonBoats, setAbandonBoats] = useState<AbandonBoatEntry[]>([]);
  const prevCrewRef = useRef<Record<string, string>>({});

  useEffect(() => {
    const prevStatuses = prevCrewRef.current;
    const newBoats: AbandonBoatEntry[] = [];

    for (const member of crew) {
      if (
        member.status === "abandoned" &&
        prevStatuses[member.id] === "active"
      ) {
        newBoats.push({
          id: `${member.id}-${Date.now()}`,
          startX: shipPosRef.current.x,
          startZ: shipPosRef.current.z,
          directionAngle: Math.random() * Math.PI * 2,
        });
      }
    }

    // Update previous statuses
    const next: Record<string, string> = {};
    for (const m of crew) {
      next[m.id] = m.status;
    }
    prevCrewRef.current = next;

    if (newBoats.length > 0) {
      setAbandonBoats((prev) => [...prev, ...newBoats]);
    }
  }, [crew]);

  const removeBoat = useCallback((id: string) => {
    setAbandonBoats((prev) => prev.filter((b) => b.id !== id));
  }, []);

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
      <WakeTrail navigation={navigation} />
      <Ship
        onWaterlineReady={onWaterlineReady}
        navigation={navigation}
        onPositionUpdate={onShipPositionUpdate}
      />
      <TreasureChestField chests={treasureChests} />
      {abandonBoats.map((boat) => (
        <AbandonShipBoat
          key={boat.id}
          startX={boat.startX}
          startZ={boat.startZ}
          directionAngle={boat.directionAngle}
          onComplete={() => removeBoat(boat.id)}
        />
      ))}
    </Suspense>
  );
}
