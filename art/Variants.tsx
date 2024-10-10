import { SpriteVariant } from '@deities/athena/info/SpriteVariants.tsx';
import { Biome } from '@deities/athena/map/Biome.tsx';
import { PlainDynamicPlayerID } from '@deities/athena/map/Player.tsx';
import { HEX } from '@nkzw/palette-swap';
import { Palette } from './VariantConfiguration.tsx';

export type SpriteVariantDetail = Readonly<{
  source: string;
  staticColors?: Set<HEX>;
  variants: Map<PlainDynamicPlayerID | Biome, Palette>;
}>;

export default new Map<SpriteVariant, SpriteVariantDetail | null>([
  ['AttackOctopus', null],
  ['Building-Create', null],
  ['Buildings', null],
  ['BuildingsShadow', null],
  ['Decorators', null],
  ['Label', null],
  ['NavalExplosion', null],
  ['Portraits', null],
  ['Rescue', null],
  ['Spawn', null],
  ['StructuresShadow', null],
  ['Units-AcidBomber', null],
  ['Units-AIU', null],
  ['Units-Alien', null],
  ['Units-Amphibious', null],
  ['Units-AntiAir', null],
  ['Units-APU', null],
  ['Units-ArtilleryHumvee', null],
  ['Units-BattleShip', null],
  ['Units-BazookaBear', null],
  ['Units-Bear', null],
  ['Units-Bomber', null],
  ['Units-Brute', null],
  ['Units-Cannon', null],
  ['Units-Commander', null],
  ['Units-Corvette', null],
  ['Units-Destroyer', null],
  ['Units-Dinosaur', null],
  ['Units-Dragon', null],
  ['Units-Drone', null],
  ['Units-FighterJet', null],
  ['Units-Flamethrower', null],
  ['Units-Frigate', null],
  ['Units-HeavyArtillery', null],
  ['Units-HeavyTank', null],
  ['Units-Helicopter', null],
  ['Units-Hovercraft', null],
  ['Units-Humvee', null],
  ['Units-HumveeAvenger', null],
  ['Units-Infantry', null],
  ['Units-InfernoJetpack', null],
  ['Units-Jeep', null],
  ['Units-Jetpack', null],
  ['Units-Lander', null],
  ['Units-Mammoth', null],
  ['Units-Medic', null],
  ['Units-MobileArtillery', null],
  ['Units-Octopus', null],
  ['Units-Ogre', null],
  ['Units-Pioneer', null],
  ['Units-ReconDrone', null],
  ['Units-RocketLauncher', null],
  ['Units-Saboteur', null],
  ['Units-SeaPatrol', null],
  ['Units-SmallHovercraft', null],
  ['Units-SmallTank', null],
  ['Units-Sniper', null],
  ['Units-SuperAPU', null],
  ['Units-SuperTank', null],
  ['Units-SupplyTrain', null],
  ['Units-SupportShip', null],
  ['Units-TransportHelicopter', null],
  ['Units-TransportTrain', null],
  ['Units-Truck', null],
  ['Units-VampireMedic', null],
  ['Units-XFighter', null],
  ['Units-Zombie', null],
] as const);
