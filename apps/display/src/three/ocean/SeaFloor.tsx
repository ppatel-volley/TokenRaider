import { useRef, useMemo, useEffect } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import {
  BufferAttribute,
  BufferGeometry,
  Group,
  MathUtils,
  Mesh,
  RepeatWrapping,
  TextureLoader,
  Uniform,
  Vector2,
  Vector3,
} from "three";
import { type SkyShaderUniforms } from "./shaders/SkyShaderMaterial";
import { createSeaFloorTriplanarMaterial } from "./shaders/SeaFloorMaterial";
import { SeededRandom, cubicInterpolation } from "./noise";

/* ------------------------------------------------------------------ */
/*  Terrain generation constants — match original exactly              */
/* ------------------------------------------------------------------ */
const TILES_PER_AXIS = 32;
const TILE_SIZE = 32;
const TILES_RADIUS = MathUtils.clamp(8, 1, TILES_PER_AXIS / 2);
const TILE_SIZE_1 = TILE_SIZE + 1;
const WORLD_SIZE = TILES_PER_AXIS * TILE_SIZE;
const WORLD_SIZE_1 = WORLD_SIZE + 1;
const SCALE = 1;
const HALF_SIZE = TILES_PER_AXIS * TILE_SIZE * 0.5 * SCALE;

const BASE1 = new Vector2(0.003, 500);
const BASE2 = new Vector2(0.008, 0.2);
const BASE3 = new Vector2(0.02, 0.1);
const EROSION = new Vector3(0.008, 0.02, 0.1);
const HILL = new Vector2(0.03, 100);

const RELIEF_POINTS = [
  0, 0,
  0.12, 0,
  0.25, 0.5,
  0.35, 0.5,
  0.45, 0.75,
  0.5, 0.75,
  0.7, 1,
  1, 1,
];

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */
export interface SeaFloorProps {
  skyUniforms: SkyShaderUniforms;
  timeUniform: Uniform<number>;
  cameraForward: Vector3;
}

/* ------------------------------------------------------------------ */
/*  Height sampling with seeded Perlin noise                          */
/* ------------------------------------------------------------------ */
function generateTerrain(): BufferGeometry[] {
  const random = new SeededRandom();

  const offsets = new Float64Array(12);
  for (let i = 0; i < offsets.length; i++) {
    offsets[i] = random.next();
  }

  function sampleHeight(x: number, y: number): number {
    let h = RELIEF_POINTS[0] * BASE1.y - BASE1.y;

    let ox = x + offsets[0];
    let oy = y + offsets[1];
    let t = random.perlin(ox * BASE1.x, oy * BASE1.x) * 0.5 + 0.5;

    ox = x + offsets[2];
    oy = y + offsets[3];
    t += (random.perlin(ox * BASE2.x, oy * BASE2.x) * 0.5 + 0.5) * BASE2.y;

    ox = x + offsets[4];
    oy = y + offsets[5];
    t += (random.perlin(ox * BASE3.x, oy * BASE3.x) * 0.5 + 0.5) * BASE3.y;

    t /= 1 + BASE2.y + BASE3.y;

    for (let i = 2; i < RELIEF_POINTS.length; i += 2) {
      if (t <= RELIEF_POINTS[i]) {
        h =
          cubicInterpolation(
            RELIEF_POINTS[i - 1],
            RELIEF_POINTS[i + 1],
            MathUtils.mapLinear(t, RELIEF_POINTS[i - 2], RELIEF_POINTS[i], 0, 1)
          ) *
            BASE1.y -
          BASE1.y;
        break;
      }
    }

    ox = x + offsets[6];
    oy = y + offsets[7];
    let e = random.perlin(ox * EROSION.x, oy * EROSION.x) * 0.5;

    ox = x + offsets[6];
    oy = y + offsets[7];
    e = Math.max(
      e -
        (random.perlin(ox * EROSION.y, oy * EROSION.y) * 0.5 + 0.5) *
          EROSION.z,
      0
    );

    ox = x + offsets[10];
    oy = y + offsets[11];
    h +=
      (random.perlin(ox * HILL.x, oy * HILL.x) * 0.5 + 0.5) * e * HILL.y -
      HILL.y * 0.3;

    return h;
  }

  /* ---------------------------------------------------------------- */
  /*  Build full-world height map + compute normals                   */
  /* ---------------------------------------------------------------- */
  const heights = new Float32Array(WORLD_SIZE_1 * WORLD_SIZE_1);
  const worldVertices = new Float32Array(heights.length * 3);
  const worldIndices: number[] = new Array(WORLD_SIZE * WORLD_SIZE * 6);

  for (let z = 0; z < WORLD_SIZE_1; z++) {
    for (let x = 0; x < WORLD_SIZE_1; x++) {
      const i = (z * WORLD_SIZE_1 + x) * 3;
      worldVertices[i] = x;
      worldVertices[i + 1] = sampleHeight(x, z);
      worldVertices[i + 2] = z;
      heights[z * WORLD_SIZE_1 + x] = worldVertices[i + 1];
    }
  }

  for (let z = 0; z < WORLD_SIZE; z++) {
    for (let x = 0; x < WORLD_SIZE; x++) {
      const v = z * WORLD_SIZE_1 + x;
      const i = (z * WORLD_SIZE + x) * 6;

      if ((x % 2 === 0 && z % 2 === 0) || (x % 2 === 1 && z % 2 === 1)) {
        worldIndices[i] = v + WORLD_SIZE_1 + 1;
        worldIndices[i + 1] = v + 1;
        worldIndices[i + 2] = v;
        worldIndices[i + 3] = v;
        worldIndices[i + 4] = v + WORLD_SIZE_1;
        worldIndices[i + 5] = v + WORLD_SIZE_1 + 1;
      } else {
        worldIndices[i] = v + WORLD_SIZE_1;
        worldIndices[i + 1] = v + 1;
        worldIndices[i + 2] = v;
        worldIndices[i + 3] = v + WORLD_SIZE_1;
        worldIndices[i + 4] = v + WORLD_SIZE_1 + 1;
        worldIndices[i + 5] = v + 1;
      }
    }
  }

  const worldGeometry = new BufferGeometry();
  worldGeometry.setAttribute("position", new BufferAttribute(worldVertices, 3));
  worldGeometry.setIndex(worldIndices);
  worldGeometry.computeVertexNormals();
  const worldNormals = (
    worldGeometry.getAttribute("normal") as BufferAttribute
  ).array as Float32Array;

  /* ---------------------------------------------------------------- */
  /*  Shared tile index buffer                                        */
  /* ---------------------------------------------------------------- */
  const tileIndices: number[] = new Array(TILE_SIZE * TILE_SIZE * 6);
  for (let z = 0; z < TILE_SIZE; z++) {
    for (let x = 0; x < TILE_SIZE; x++) {
      const v = z * TILE_SIZE_1 + x;
      const i = (z * TILE_SIZE + x) * 6;

      if ((x % 2 === 0 && z % 2 === 0) || (x % 2 === 1 && z % 2 === 1)) {
        tileIndices[i] = v + TILE_SIZE_1 + 1;
        tileIndices[i + 1] = v + 1;
        tileIndices[i + 2] = v;
        tileIndices[i + 3] = v;
        tileIndices[i + 4] = v + TILE_SIZE_1;
        tileIndices[i + 5] = v + TILE_SIZE_1 + 1;
      } else {
        tileIndices[i] = v + TILE_SIZE_1;
        tileIndices[i + 1] = v + 1;
        tileIndices[i + 2] = v;
        tileIndices[i + 3] = v + TILE_SIZE_1;
        tileIndices[i + 4] = v + TILE_SIZE_1 + 1;
        tileIndices[i + 5] = v + 1;
      }
    }
  }

  /* ---------------------------------------------------------------- */
  /*  Per-tile geometries                                             */
  /* ---------------------------------------------------------------- */
  const tileGeometries: BufferGeometry[] = new Array(
    TILES_PER_AXIS * TILES_PER_AXIS
  );

  for (let tileZ = 0; tileZ < TILES_PER_AXIS; tileZ++) {
    for (let tileX = 0; tileX < TILES_PER_AXIS; tileX++) {
      const vertices = new Float32Array(TILE_SIZE_1 * TILE_SIZE_1 * 3);
      const normals = new Float32Array(vertices.length);

      for (let z = 0; z < TILE_SIZE_1; z++) {
        for (let x = 0; x < TILE_SIZE_1; x++) {
          const i = (z * TILE_SIZE_1 + x) * 3;
          const worldX = x + tileX * TILE_SIZE;
          const worldZ = z + tileZ * TILE_SIZE;

          vertices[i] = (worldX - HALF_SIZE) * SCALE;
          vertices[i + 1] = heights[worldZ * WORLD_SIZE_1 + worldX] * SCALE;
          vertices[i + 2] = (worldZ - HALF_SIZE) * SCALE;

          const j =
            ((tileZ * TILE_SIZE + z) * WORLD_SIZE_1 +
              tileX * TILE_SIZE +
              x) *
            3;
          normals[i] = worldNormals[j];
          normals[i + 1] = worldNormals[j + 1];
          normals[i + 2] = worldNormals[j + 2];
        }
      }

      const geometry = new BufferGeometry();
      geometry.setAttribute("position", new BufferAttribute(vertices, 3));
      geometry.setIndex(tileIndices);
      geometry.setAttribute("normal", new BufferAttribute(normals, 3));

      tileGeometries[tileZ * TILES_PER_AXIS + tileX] = geometry;
    }
  }

  worldGeometry.dispose();

  return tileGeometries;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export function SeaFloor({ skyUniforms, timeUniform, cameraForward }: SeaFloorProps) {
  const groupRef = useRef<Group>(null);
  const meshRefs = useRef<(Mesh | null)[]>([]);
  const lastVisibleRef = useRef<number[]>([]);

  const sandTexture = useLoader(TextureLoader, "/textures/ocean/sand.png");
  useMemo(() => {
    sandTexture.wrapS = RepeatWrapping;
    sandTexture.wrapT = RepeatWrapping;
  }, [sandTexture]);

  // Heavy computation — only runs once.
  const tileGeometries = useMemo(() => generateTerrain(), []);

  const material = useMemo(
    () =>
      createSeaFloorTriplanarMaterial({
        skyUniforms,
        timeUniform,
        mainTexture: sandTexture,
        cameraForward,
      }),
    [skyUniforms, timeUniform, sandTexture, cameraForward]
  );

  // Dispose geometries on unmount.
  useEffect(() => {
    return () => {
      for (const geom of tileGeometries) {
        geom.dispose();
      }
    };
  }, [tileGeometries]);

  // Chunk visibility based on camera position.
  useFrame(({ camera }) => {
    const playerTile =
      MathUtils.clamp(
        Math.round((camera.position.z + HALF_SIZE) / TILE_SIZE),
        TILES_RADIUS,
        TILES_PER_AXIS - TILES_RADIUS
      ) *
        TILES_PER_AXIS +
      MathUtils.clamp(
        Math.round((camera.position.x + HALF_SIZE) / TILE_SIZE),
        TILES_RADIUS,
        TILES_PER_AXIS - TILES_RADIUS
      );

    for (const idx of lastVisibleRef.current) {
      const mesh = meshRefs.current[idx];
      if (mesh) mesh.visible = false;
    }

    const newVisible: number[] = [];
    for (let z = -TILES_RADIUS; z < TILES_RADIUS; z++) {
      for (let x = -TILES_RADIUS; x < TILES_RADIUS; x++) {
        const i = playerTile + z * TILES_PER_AXIS + x;
        if (i >= 0 && i < tileGeometries.length) {
          newVisible.push(i);
          const mesh = meshRefs.current[i];
          if (mesh) mesh.visible = true;
        }
      }
    }
    lastVisibleRef.current = newVisible;
  });

  return (
    <group ref={groupRef}>
      {tileGeometries.map((geom, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshRefs.current[i] = el;
          }}
          geometry={geom}
          material={material}
          visible={false}
        />
      ))}
    </group>
  );
}
