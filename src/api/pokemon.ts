import { POKEAPI_BASE_URL } from '@/constants/api';

export type PokemonListItem = {
  id: number;
  name: string;
};

type PokeApiListResponse = {
  results: { name: string; url: string }[];
};

const parseIdFromUrl = (url: string): number => {
  const match = url.match(/\/pokemon\/(\d+)\/?$/);
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

export type PokemonDetail = {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: string[];
  abilities: string[];
  stats: PokemonStat[];
  imageUrl: string | null;
};

type PokeApiDetailResponse = {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  sprites: {
    front_default: string | null;
    other?: {
      'official-artwork'?: { front_default: string | null };
    };
  };
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
    types: data.types.map((entry) => formatName(entry.type.name)),
    abilities: data.abilities.map((entry) => formatName(entry.ability.name)),
    stats: data.stats.map((entry) => ({
      key: entry.stat.name,
      label: STAT_LABELS[entry.stat.name] ?? formatName(entry.stat.name),
      value: entry.base_stat,
    })),
    imageUrl: data.sprites.other?.['official-artwork']?.front_default ?? data.sprites.front_default,
  };
};
