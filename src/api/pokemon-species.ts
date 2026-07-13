import { parseIdFromUrl } from '@/api/pokemon';
import { POKEAPI_BASE_URL } from '@/constants/api';

export type PokemonSpecies = {
  id: number;
  genus: string;
  flavorText: string;
  color: string;
  shape: string;
  habitat: string | null;
  isLegendary: boolean;
  isMythical: boolean;
  isBaby: boolean;
  captureRate: number;
  baseHappiness: number;
  growthRate: string;
  genderRate: number;
  hatchCounter: number;
  evolutionChainId: number;
};

type PokeApiSpeciesResponse = {
  id: number;
  genera: { genus: string; language: { name: string } }[];
  flavor_text_entries: { flavor_text: string; language: { name: string } }[];
  color: { name: string };
  shape: { name: string } | null;
  habitat: { name: string } | null;
  is_legendary: boolean;
  is_mythical: boolean;
  is_baby: boolean;
  capture_rate: number;
  base_happiness: number;
  growth_rate: { name: string };
  gender_rate: number;
  hatch_counter: number;
  evolution_chain: { url: string };
};

export const fetchPokemonSpecies = async (id: number): Promise<PokemonSpecies> => {
  const response = await fetch(`${POKEAPI_BASE_URL}/pokemon-species/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon species ${id}: ${response.status}`);
  }

  const data: PokeApiSpeciesResponse = await response.json();

  const genus = data.genera.find((entry) => entry.language.name === 'en')?.genus ?? '';
  const flavorText =
    data.flavor_text_entries
      .find((entry) => entry.language.name === 'en')
      ?.flavor_text.replace(/[\n\f\r]+/g, ' ') ?? '';

  return {
    id: data.id,
    genus,
    flavorText,
    color: data.color.name,
    shape: data.shape?.name ?? 'unknown',
    habitat: data.habitat?.name ?? null,
    isLegendary: data.is_legendary,
    isMythical: data.is_mythical,
    isBaby: data.is_baby,
    captureRate: data.capture_rate,
    baseHappiness: data.base_happiness,
    growthRate: data.growth_rate.name,
    genderRate: data.gender_rate,
    hatchCounter: data.hatch_counter,
    evolutionChainId: parseIdFromUrl(data.evolution_chain.url),
  };
};
