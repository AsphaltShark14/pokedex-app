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

const formatName = (name: string): string =>
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

export type EvolutionNode = {
  id: number;
  name: string;
  children: EvolutionNode[];
};

type PokeApiEvolutionChainLink = {
  species: { name: string; url: string };
  evolves_to: PokeApiEvolutionChainLink[];
};

type PokeApiEvolutionChainResponse = {
  chain: PokeApiEvolutionChainLink;
};

const mapEvolutionLink = (link: PokeApiEvolutionChainLink): EvolutionNode => ({
  id: parseIdFromUrl(link.species.url),
  name: formatName(link.species.name),
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
