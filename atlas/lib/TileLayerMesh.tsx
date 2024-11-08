import { VectorLike } from '@deities/athena/map/Vector.tsx';
import { useMemo } from 'react';
import { Texture, Vector3 } from 'three';

export interface TileLayerMeshSprite {
  position: VectorLike;
}

export type TileLayerMeshSprites = Array<Array<TileLayerMeshSprite>>;

// TODO: Need proper support for dynamic mesh attributes

export default function TileLayerMesh({
  height,
  position = [0, 0, 0],
  sprites,
  texture,
  tileSize,
  width,
}: {
  height: number;
  position?: Vector3 | [number, number, number];
  sprites: TileLayerMeshSprites;
  texture: Texture;
  tileSize: number;
  width: number;
}) {
  const [typedNormals, typedVertices, typedIndices] = useMemo(() => {
    const vertices: Array<number> = [];
    const indices: Array<number> = [];
    const normals: Array<number> = [];

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        const xOffset = (width / 2) * tileSize;
        const yOffset = (height / 2) * tileSize;

        vertices.push(
          x * tileSize - xOffset,
          y * tileSize - yOffset,
          0, // top left
          x * tileSize - xOffset,
          (y + 1) * tileSize - yOffset,
          0, // bottom left
          (x + 1) * tileSize - xOffset,
          (y + 1) * tileSize - yOffset,
          0, // bottom right
          (x + 1) * tileSize - xOffset,
          y * tileSize - yOffset,
          0, // top right
        );

        normals.push(0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1);

        indices.push(
          index + 0,
          index + 1,
          index + 3,
          index + 1,
          index + 2,
          index + 3,
        );
      }
    }

    return [
      new Float32Array(normals),
      new Float32Array(vertices),
      new Uint16Array(indices),
    ];
  }, [width, height, tileSize]);

  const typedUvs = useMemo(() => {
    const uvs: Array<number> = [];
    const uSize = 1 / (texture.image.width / tileSize);
    const vSize = 1 / (texture.image.height / tileSize);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const sprite = sprites[x][y];

        const u = sprite.position.x * uSize;
        const v = 1 - sprite.position.y * vSize;

        uvs.push(u, v, u, v - vSize, u + uSize, v - vSize, u + uSize, v);
      }
    }

    return new Float32Array(uvs);
  }, [sprites, width, height, texture, tileSize]);

  return (
    <mesh position={position}>
      <bufferGeometry>
        <bufferAttribute
          args={[typedVertices, 3]}
          attach="attributes-position"
        />
        <bufferAttribute args={[typedNormals, 3]} attach="attributes-normal" />
        <bufferAttribute args={[typedUvs, 2]} attach="attributes-uv" />
        <bufferAttribute args={[typedIndices, 1]} attach="index" />
      </bufferGeometry>
      <meshBasicMaterial color={0xff_ff_ff} map={texture} transparent />
    </mesh>
  );
}
