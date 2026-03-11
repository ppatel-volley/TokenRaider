import { useRef } from "react"
import * as THREE from "three"

interface ArenaProps {
    size: number
}

const GRID_DIVISIONS = 20
const FLOOR_COLOUR = "#111128"
const GRID_COLOUR = "#2a2a4a"
const EDGE_COLOUR = "#fbbf24"

export function Arena({ size }: ArenaProps) {
    const floorRef = useRef<THREE.Mesh>(null)

    const halfSize = size / 2

    return (
        <group>
            {/* Floor plane */}
            <mesh
                ref={floorRef}
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, -0.01, 0]}
                receiveShadow
            >
                <planeGeometry args={[size, size]} />
                <meshStandardMaterial
                    color={FLOOR_COLOUR}
                    roughness={0.9}
                    metalness={0.1}
                />
            </mesh>

            {/* Grid lines */}
            <gridHelper
                args={[size, GRID_DIVISIONS, GRID_COLOUR, GRID_COLOUR]}
                position={[0, 0, 0]}
            />

            {/* Glowing arena edges */}
            <lineSegments position={[0, 0.05, 0]}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        args={[
                            new Float32Array([
                                -halfSize, 0, -halfSize,
                                halfSize, 0, -halfSize,
                                halfSize, 0, -halfSize,
                                halfSize, 0, halfSize,
                                halfSize, 0, halfSize,
                                -halfSize, 0, halfSize,
                                -halfSize, 0, halfSize,
                                -halfSize, 0, -halfSize,
                            ]),
                            3,
                        ]}
                    />
                </bufferGeometry>
                <lineBasicMaterial color={EDGE_COLOUR} linewidth={2} />
            </lineSegments>
        </group>
    )
}
