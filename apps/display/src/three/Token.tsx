import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface TokenProps {
    position: [number, number, number]
    value: number
    collected: boolean
}

const FLOAT_AMPLITUDE = 0.3
const FLOAT_SPEED = 2
const ROTATION_SPEED = 1.2

/** Value-to-colour mapping: higher value = warmer colour */
function getTokenColour(value: number): string {
    if (value >= 300) return "#ef4444"
    if (value >= 200) return "#f59e0b"
    return "#fbbf24"
}

export function Token({ position, value, collected }: TokenProps) {
    const meshRef = useRef<THREE.Mesh>(null)
    const materialRef = useRef<THREE.MeshStandardMaterial>(null)
    const initialY = position[1]

    useFrame((state) => {
        if (!meshRef.current || !materialRef.current) return

        const elapsed = state.clock.elapsedTime

        // Floating animation
        meshRef.current.position.y =
            initialY + Math.sin(elapsed * FLOAT_SPEED) * FLOAT_AMPLITUDE

        // Rotation
        meshRef.current.rotation.y += ROTATION_SPEED * state.clock.getDelta()
        meshRef.current.rotation.x += ROTATION_SPEED * 0.3 * state.clock.getDelta()

        // Fade out when collected
        if (collected) {
            materialRef.current.opacity = Math.max(
                0,
                materialRef.current.opacity - state.clock.getDelta() * 3,
            )
            meshRef.current.scale.multiplyScalar(0.95)
        }
    })

    if (collected && meshRef.current) {
        const opacity = (meshRef.current.material as THREE.MeshStandardMaterial)
            .opacity
        if (opacity <= 0.01) return <></>
    }

    return (
        <mesh ref={meshRef} position={position} castShadow>
            <dodecahedronGeometry args={[0.5, 0]} />
            <meshStandardMaterial
                ref={materialRef}
                color={getTokenColour(value)}
                emissive={getTokenColour(value)}
                emissiveIntensity={0.4}
                roughness={0.3}
                metalness={0.6}
                transparent
                opacity={1}
            />
        </mesh>
    )
}
