import { BuildingInfo } from '../info/Building.tsx';
import { ConstructionSite, Plain } from '../info/Tile.tsx';
import { PlayerID } from '../map/Player.tsx';
import Vector from '../map/Vector.tsx';
import MapData from '../MapData.tsx';
import writeTile from '../mutation/writeTile.tsx';
import canBuild from './canBuild.tsx';

export default function couldSpawnBuilding(
  map: MapData,
  vector: Vector,
  building: BuildingInfo,
  player: PlayerID,
) {
  if (map.getTileInfo(vector) === Plain) {
    const tiles = map.map.slice();
    const modifiers = map.modifiers.slice();
    writeTile(tiles, modifiers, map.getTileIndex(vector), ConstructionSite);
    map = map.copy({
      map: tiles,
    });
  }

  return (
    !map.buildings.has(vector) && canBuild(map, building, player, vector, true)
  );
}
