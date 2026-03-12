import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import type { Mesh } from "three"
import type { ChestType } from "@token-raider/shared"

const FOOD_COLOR = "#22c55e"
const MORALE_COLOR = "#fbbf24"
const BOB_SPEED = 1.5
const BOB_AMPLITUDE = 0.3
const ROTATION_SPEED = 0.6

interface TreasureChestProps {
    x: number
    z: number
    type: ChestType
    collected: boolean
}

export function TreasureChest({ x, z, type, collected }: TreasureChestProps) {
    const meshRef = useRef<Mesh>(null)

    useFrame(({ clock }) => {
        if (!meshRef.current) return
        const t = clock.getElapsedTime()
        meshRef.current.position.y = 0.5 + Math.sin(t * BOB_SPEED) * BOB_AMPLITUDE
        meshRef.current.rotation.y += ROTATION_SPEED * 0.016
    })

    if (collected) return null

    const color = type === "food" ? FOOD_COLOR : MORALE_COLOR

    return (
        <mesh ref={meshRef} position={[x, 0.5, z]}>
            <boxGeometry args={[1.2, 0.8, 0.8]} />
            <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.4}
                roughness={0.3}
                metalness={0.6}
            />
            <pointLight color={color} intensity={2} distance={8} decay={2} />
        </mesh>
    )
}
