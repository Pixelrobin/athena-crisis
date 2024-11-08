import { Plain, TileLayer } from '@deities/athena/info/Tile.tsx';
import { Biome } from '@deities/athena/map/Biome.tsx';
import vec from '@deities/athena/map/vec.tsx';
import MapData from '@deities/athena/MapData.tsx';
import { VisionT } from '@deities/athena/Vision.tsx';
import { useLoader } from '@react-three/fiber';
import {
  Tiles0,
  Tiles1,
  Tiles2,
  Tiles3,
  Tiles4,
  Tiles5,
  Tiles6,
} from 'athena-crisis:images';
import { NearestFilter, TextureLoader } from 'three';
import TileLayerMesh, {
  TileLayerMeshSprite,
  TileLayerMeshSprites,
} from './lib/TileLayerMesh.tsx';

export type TileStyle = 'floating' | 'clip' | 'none';

/*

TODO:

- Support for animation. Likely with a custom shader and animation info being passed into the GPU via attributes.
- Support for different tile rendering types. I'd likely need to split all tiles into 4 individual quads to support all render types. Needs more research.
- Need to research more what floating tiles are, etc.

*/

const sprites = {
  [Biome.Grassland]: Tiles0,
  [Biome.Desert]: Tiles1,
  [Biome.Snow]: Tiles2,
  [Biome.Swamp]: Tiles3,
  [Biome.Spaceship]: Tiles4,
  [Biome.Volcano]: Tiles5,
  [Biome.Luna]: Tiles6,
} as const;

export default function Tiles({
  map,
  paused,
  renderEntities = true,
  style,
  tileSize: size,
  vision,
}: {
  map: MapData;
  paused?: boolean;
  renderEntities?: boolean;
  style?: TileStyle;
  tileSize: number;
  vision: VisionT;
}) {
  const { biome } = map.config;
  const sprite = sprites[biome];

  const texture = useLoader(TextureLoader, sprite.src);

  texture.minFilter = NearestFilter;
  texture.magFilter = NearestFilter;

  const layerPlainSprites: TileLayerMeshSprites = [];
  const layer0Sprites: TileLayerMeshSprites = [];
  const layer1Sprites: TileLayerMeshSprites = [];

  const blankTileSprite: TileLayerMeshSprite = {
    position: {
      x: 3,
      y: 0,
    },
  };

  const setTileSpriteFromMap = (
    sprites: TileLayerMeshSprites,
    x: number,
    y: number,
    layer: TileLayer,
  ) => {
    const vector = vec(x + 1, y + 1);
    const tile = map.getTile(vector, layer);
    let sprite: TileLayerMeshSprite = blankTileSprite;

    if (tile) {
      const vector = vec(x + 1, y + 1);
      const info = map.getTileInfo(vector, layer);
      const modifierId = map.getModifier(vector, layer);
      const modifier = info.sprite.modifiers.get(modifierId);

      let sx = info.sprite.position.x;
      let sy = info.sprite.position.y;

      if (modifier && !Array.isArray(modifier)) {
        sx += modifier.x;
        sy += modifier.y;
      }

      sprite = {
        position: {
          x: sx,
          y: sy,
        },
      };
    }

    sprites[x][y] = sprite;
  };

  for (let x = 0; x < map.size.width; x++) {
    layerPlainSprites[x] = [];
    layer0Sprites[x] = [];
    layer1Sprites[x] = [];

    for (let y = 0; y < map.size.height; y++) {
      setTileSpriteFromMap(layer0Sprites, x, y, 0);
      setTileSpriteFromMap(layer1Sprites, x, y, 1);

      layerPlainSprites[x][y] = {
        position: Plain.sprite.position,
      };
    }
  }

  return (
    <>
      <TileLayerMesh
        height={map.size.height}
        position={[0, 0, -10]}
        sprites={layerPlainSprites}
        texture={texture}
        tileSize={size}
        width={map.size.width}
      />
      <TileLayerMesh
        height={map.size.height}
        position={[0, 0, -5]}
        sprites={layer0Sprites}
        texture={texture}
        tileSize={size}
        width={map.size.width}
      />
      <TileLayerMesh
        height={map.size.height}
        position={[0, 0, 0]}
        sprites={layer1Sprites}
        texture={texture}
        tileSize={size}
        width={map.size.width}
      />
    </>
  );
}
