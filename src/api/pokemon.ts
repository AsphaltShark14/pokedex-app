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
