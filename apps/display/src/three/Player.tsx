import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface PlayerProps {
    position: [number, number, number]
}

const PULSE_SPEED = 3
const PULSE_MIN = 0.3
const PULSE_MAX = 0.6
const PLAYER_COLOUR = "#60a5fa"

export function Player({ position }: PlayerProps) {
    const meshRef = useRef<THREE.Mesh>(null)
    const glowRef = useRef<THREE.PointLight>(null)

    useFrame((state) => {
        if (!meshRef.current) return

        // Smoothly interpolate towards target position
        meshRef.current.position.lerp(
            new THREE.Vector3(position[0], position[1], position[2]),
            0.15,
        )

        // Pulse glow effect
        const elapsed = state.clock.elapsedTime
        const pulse =
            PULSE_MIN + (PULSE_MAX - PULSE_MIN) * ((Math.sin(elapsed * PULSE_SPEED) + 1) / 2)

        if (glowRef.current) {
            glowRef.current.intensity = pulse * 3
            glowRef.current.position.copy(meshRef.current.position)
        }
    })

    return (
        <group>
            <mesh ref={meshRef} position={position} castShadow>
                <sphereGeometry args={[0.35, 32, 32]} />
                <meshStandardMaterial
                    color={PLAYER_COLOUR}
                    emissive={PLAYER_COLOUR}
                    emissiveIntensity={0.5}
                    roughness={0.2}
                    metalness={0.8}
                />
            </mesh>
            <pointLight
                ref={glowRef}
                position={position}
                color={PLAYER_COLOUR}
                intensity={0.5}
                distance={5}
                decay={2}
            />
        </group>
    )
}
