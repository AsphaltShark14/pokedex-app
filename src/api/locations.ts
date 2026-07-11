import type { PokeResourceItem } from '@/api/poke-resource';
import { parseIdFromUrl } from '@/api/pokemon';
import { POKEAPI_BASE_URL } from '@/constants/api';

export type LocationDetail = {
  id: number;
  name: string;
  region: { id: number; name: string };
  areas: PokeResourceItem[];
};

type PokeApiLocationResponse = {
  id: number;
  name: string;
  region: { name: string; url: string };
  areas: { name: string; url: string }[];
};

export const fetchLocationDetail = async (id: number): Promise<LocationDetail> => {
  const response = await fetch(`${POKEAPI_BASE_URL}/location/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch location ${id}: ${response.status}`);
  }

  const data: PokeApiLocationResponse = await response.json();

  return {
    id: data.id,
    name: data.name,
    region: { id: parseIdFromUrl(data.region.url), name: data.region.name },
    areas: data.areas.map((area) => ({ id: parseIdFromUrl(area.url), name: area.name })),
  };
};

export type LocationAreaDetail = {
  id: number;
  name: string;
  location: { id: number; name: string };
  pokemonEncounters: PokeResourceItem[];
};

type PokeApiLocationAreaResponse = {
  id: number;
  name: string;
  location: { name: string; url: string };
  pokemon_encounters: { pokemon: { name: string; url: string } }[];
};

export const fetchLocationAreaDetail = async (id: number): Promise<LocationAreaDetail> => {
  const response = await fetch(`${POKEAPI_BASE_URL}/location-area/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch location-area ${id}: ${response.status}`);
  }

  const data: PokeApiLocationAreaResponse = await response.json();

  const pokemonEncounters: PokeResourceItem[] = [];
  const seenIds = new Set<number>();
  for (const entry of data.pokemon_encounters) {
    const pokemonId = parseIdFromUrl(entry.pokemon.url);
    if (!seenIds.has(pokemonId)) {
      seenIds.add(pokemonId);
      pokemonEncounters.push({ id: pokemonId, name: entry.pokemon.name });
    }
  }

  return {
    id: data.id,
    name: data.name,
    location: { id: parseIdFromUrl(data.location.url), name: data.location.name },
    pokemonEncounters,
  };
};

type PokeApiRegionResponse = {
  name: string;
  locations: { name: string; url: string }[];
};

export const fetchRegionLocations = async (
  id: number,
): Promise<{ name: string; locations: PokeResourceItem[] }> => {
  const response = await fetch(`${POKEAPI_BASE_URL}/region/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch region ${id}: ${response.status}`);
  }

  const data: PokeApiRegionResponse = await response.json();

  return {
    name: data.name,
    locations: data.locations.map((location) => ({
      id: parseIdFromUrl(location.url),
      name: location.name,
    })),
  };
};
