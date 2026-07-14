import type { PokeResourceItem } from '@/api/poke-resource';
import { POKEAPI_BASE_URL } from '@/constants/api';

export type PokemonListItem = {
  id: number;
  name: string;
};

type PokeApiListResponse = {
  results: { name: string; url: string }[];
};

// Matches the trailing numeric id in any PokeAPI resource URL
// (/pokemon/1/, /pokemon-species/25/, /evolution-chain/10/, ...).
export const parseIdFromUrl = (url: string): number => {
  const match = url.match(/\/(\d+)\/?$/);
  return match ? Number(match[1]) : 0;
};

export const fetchPokemonList = async (limit: number): Promise<PokemonListItem[]> => {
  const response = await fetch(`${POKEAPI_BASE_URL}/pokemon?limit=${limit}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon list: ${response.status}`);
  }

  const data: PokeApiListResponse = await response.json();

  return data.results.map((entry) => ({
    id: parseIdFromUrl(entry.url),
    name: entry.name,
  }));
};

export type PokemonStat = {
  key: string;
  label: string;
  value: number;
};

export type PokemonAbility = {
  id: number;
  name: string;
  isHidden: boolean;
};

export type PokemonHeldItem = {
  item: PokeResourceItem;
  rarity: number;
};

export type PokemonMove = {
  id: number;
  name: string;
  method: string;
  levelLearnedAt: number;
};

export type PokemonDetail = {
  id: number;
  name: string;
  height: number;
  weight: number;
  baseExperience: number;
  types: string[];
  abilities: PokemonAbility[];
  stats: PokemonStat[];
  imageUrl: string | null;
  heldItems: PokemonHeldItem[];
  moves: PokemonMove[];
};

type PokeApiDetailResponse = {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  types: { type: { name: string } }[];
  abilities: { ability: { name: string; url: string }; is_hidden: boolean }[];
  stats: { base_stat: number; stat: { name: string } }[];
  sprites: {
    front_default: string | null;
    other?: {
      'official-artwork'?: { front_default: string | null };
    };
  };
  held_items: { item: { name: string; url: string }; version_details: { rarity: number }[] }[];
  moves: {
    move: { name: string; url: string };
    version_group_details: { level_learned_at: number; move_learn_method: { name: string } }[];
  }[];
};

const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
};

export const formatName = (name: string): string =>
  name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const fetchPokemonDetail = async (id: number): Promise<PokemonDetail> => {
  const response = await fetch(`${POKEAPI_BASE_URL}/pokemon/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon ${id}: ${response.status}`);
  }

  const data: PokeApiDetailResponse = await response.json();

  return {
    id: data.id,
    name: formatName(data.name),
    height: data.height,
    weight: data.weight,
    baseExperience: data.base_experience,
    types: data.types.map((entry) => formatName(entry.type.name)),
    abilities: data.abilities.map((entry) => ({
      id: parseIdFromUrl(entry.ability.url),
      name: formatName(entry.ability.name),
      isHidden: entry.is_hidden,
    })),
    stats: data.stats.map((entry) => ({
      key: entry.stat.name,
      label: STAT_LABELS[entry.stat.name] ?? formatName(entry.stat.name),
      value: entry.base_stat,
    })),
    imageUrl: data.sprites.other?.['official-artwork']?.front_default ?? data.sprites.front_default,
    heldItems: data.held_items.map((entry) => ({
      item: { id: parseIdFromUrl(entry.item.url), name: entry.item.name },
      rarity: entry.version_details[0]?.rarity ?? 0,
    })),
    moves: data.moves.map((entry) => {
      const latestDetail = entry.version_group_details[entry.version_group_details.length - 1];
      return {
        id: parseIdFromUrl(entry.move.url),
        name: formatName(entry.move.name),
        method: formatName(latestDetail?.move_learn_method.name ?? 'other'),
        levelLearnedAt: latestDetail?.level_learned_at ?? 0,
      };
    }),
  };
};

export type EvolutionNamedValue = {
  name: string;
  formattedName: string;
};

export type EvolutionCondition = {
  trigger: string;
  item: EvolutionNamedValue | null;
  heldItem: EvolutionNamedValue | null;
  knownMove: string | null;
  knownMoveType: string | null;
  location: string | null;
  minLevel: number | null;
  minHappiness: number | null;
  minAffection: number | null;
  minBeauty: number | null;
  needsOverworldRain: boolean;
  partySpecies: string | null;
  partyType: string | null;
  relativePhysicalStats: number | null;
  timeOfDay: string | null;
  tradeSpecies: string | null;
  turnUpsideDown: boolean;
  gender: number | null;
};

export type EvolutionNode = {
  id: number;
  name: string;
  evolutionDetails: EvolutionCondition[];
  children: EvolutionNode[];
};

type PokeApiNamedResource = { name: string; url: string };

type PokeApiEvolutionDetail = {
  item: PokeApiNamedResource | null;
  trigger: PokeApiNamedResource;
  gender: number | null;
  held_item: PokeApiNamedResource | null;
  known_move: PokeApiNamedResource | null;
  known_move_type: PokeApiNamedResource | null;
  location: PokeApiNamedResource | null;
  min_affection: number | null;
  min_beauty: number | null;
  min_happiness: number | null;
  min_level: number | null;
  needs_overworld_rain: boolean;
  party_species: PokeApiNamedResource | null;
  party_type: PokeApiNamedResource | null;
  relative_physical_stats: number | null;
  time_of_day: string;
  trade_species: PokeApiNamedResource | null;
  turn_upside_down: boolean;
};

type PokeApiEvolutionChainLink = {
  species: { name: string; url: string };
  evolution_details: PokeApiEvolutionDetail[];
  evolves_to: PokeApiEvolutionChainLink[];
};

type PokeApiEvolutionChainResponse = {
  chain: PokeApiEvolutionChainLink;
};

const mapNamedValue = (resource: PokeApiNamedResource | null): EvolutionNamedValue | null =>
  resource ? { name: resource.name, formattedName: formatName(resource.name) } : null;

const mapFormattedName = (resource: PokeApiNamedResource | null): string | null =>
  resource ? formatName(resource.name) : null;

const mapEvolutionDetail = (detail: PokeApiEvolutionDetail): EvolutionCondition => ({
  trigger: detail.trigger.name,
  item: mapNamedValue(detail.item),
  heldItem: mapNamedValue(detail.held_item),
  knownMove: mapFormattedName(detail.known_move),
  knownMoveType: mapFormattedName(detail.known_move_type),
  location: mapFormattedName(detail.location),
  minLevel: detail.min_level,
  minHappiness: detail.min_happiness,
  minAffection: detail.min_affection,
  minBeauty: detail.min_beauty,
  needsOverworldRain: detail.needs_overworld_rain,
  partySpecies: mapFormattedName(detail.party_species),
  partyType: mapFormattedName(detail.party_type),
  relativePhysicalStats: detail.relative_physical_stats,
  timeOfDay: detail.time_of_day || null,
  tradeSpecies: mapFormattedName(detail.trade_species),
  turnUpsideDown: detail.turn_upside_down,
  gender: detail.gender,
});

const mapEvolutionLink = (link: PokeApiEvolutionChainLink): EvolutionNode => ({
  id: parseIdFromUrl(link.species.url),
  name: formatName(link.species.name),
  evolutionDetails: link.evolution_details.map(mapEvolutionDetail),
  children: link.evolves_to.map(mapEvolutionLink),
});

export const fetchEvolutionChainById = async (chainId: number): Promise<EvolutionNode> => {
  const chainResponse = await fetch(`${POKEAPI_BASE_URL}/evolution-chain/${chainId}`);

  if (!chainResponse.ok) {
    throw new Error(`Failed to fetch evolution chain ${chainId}: ${chainResponse.status}`);
  }

  const chainData: PokeApiEvolutionChainResponse = await chainResponse.json();

  return mapEvolutionLink(chainData.chain);
};
