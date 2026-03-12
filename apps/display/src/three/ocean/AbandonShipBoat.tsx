import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import type { Group } from "three"

const BOAT_SPEED = 5
const BOAT_LIFETIME = 4

interface AbandonShipBoatProps {
    startX: number
    startZ: number
    /** Random direction angle in radians */
    directionAngle: number
    onComplete: () => void
}

export function AbandonShipBoat({
    startX,
    startZ,
    directionAngle,
    onComplete,
}: AbandonShipBoatProps) {
    const groupRef = useRef<Group>(null)
    const [elapsed] = useState({ value: 0 })

    useFrame((_, delta) => {
        if (!groupRef.current) return
        elapsed.value += delta

        if (elapsed.value >= BOAT_LIFETIME) {
            onComplete()
            return
        }

        // Move in the chosen direction
        groupRef.current.position.x += Math.sin(directionAngle) * BOAT_SPEED * delta
        groupRef.current.position.z += Math.cos(directionAngle) * BOAT_SPEED * delta

        // Bob gently
        groupRef.current.position.y = 0.2 + Math.sin(elapsed.value * 3) * 0.1

        // Fade out via scale near the end
        const fadeStart = BOAT_LIFETIME * 0.6
        if (elapsed.value > fadeStart) {
            const t = (elapsed.value - fadeStart) / (BOAT_LIFETIME - fadeStart)
            const s = Math.max(0, 1 - t)
            groupRef.current.scale.setScalar(s)
        }
    })

    return (
        <group ref={groupRef} position={[startX, 0.2, startZ]}>
            {/* Tiny boat hull */}
            <mesh>
                <boxGeometry args={[0.4, 0.15, 0.7]} />
                <meshStandardMaterial color="#8B4513" roughness={0.8} />
            </mesh>
            {/* Tiny mast */}
            <mesh position={[0, 0.25, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.4]} />
                <meshStandardMaterial color="#654321" />
            </mesh>
            {/* Tiny sail */}
            <mesh position={[0.08, 0.3, 0]}>
                <planeGeometry args={[0.2, 0.25]} />
                <meshStandardMaterial color="#f5f5dc" side={2} />
            </mesh>
        </group>
    )
}
