import type { TreasureChest as TreasureChestType } from "@token-raider/shared"
import { TreasureChest } from "./TreasureChest"

interface TreasureChestFieldProps {
    chests: TreasureChestType[]
}

export function TreasureChestField({ chests }: TreasureChestFieldProps) {
    return (
        <>
            {chests.map((chest) => (
                <TreasureChest
                    key={chest.id}
                    x={chest.x}
                    z={chest.z}
                    type={chest.type}
                    collected={chest.collected}
                />
            ))}
        </>
    )
}
