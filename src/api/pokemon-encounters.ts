import type { PokeResourceItem } from '@/api/poke-resource';
import { parseIdFromUrl } from '@/api/pokemon';
import { POKEAPI_BASE_URL } from '@/constants/api';

type PokeApiEncounterEntry = {
  location_area: { name: string; url: string };
};

export const fetchPokemonEncounters = async (id: number): Promise<PokeResourceItem[]> => {
  const response = await fetch(`${POKEAPI_BASE_URL}/pokemon/${id}/encounters`);

  if (!response.ok) {
    throw new Error(`Failed to fetch encounters for Pokemon ${id}: ${response.status}`);
  }

  const data: PokeApiEncounterEntry[] = await response.json();

  const locationAreas: PokeResourceItem[] = [];
  const seenIds = new Set<number>();
  for (const entry of data) {
    const locationAreaId = parseIdFromUrl(entry.location_area.url);
    if (!seenIds.has(locationAreaId)) {
      seenIds.add(locationAreaId);
      locationAreas.push({ id: locationAreaId, name: entry.location_area.name });
    }
  }

  return locationAreas;
};
