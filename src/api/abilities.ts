import { POKEAPI_BASE_URL } from '@/constants/api';

export type AbilityDetail = {
  id: number;
  name: string;
  shortEffect: string;
};

type PokeApiAbilityResponse = {
  id: number;
  name: string;
  effect_entries: { short_effect: string; language: { name: string } }[];
};

export const fetchAbilityDetail = async (id: number): Promise<AbilityDetail> => {
  const response = await fetch(`${POKEAPI_BASE_URL}/ability/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch ability ${id}: ${response.status}`);
  }

  const data: PokeApiAbilityResponse = await response.json();

  return {
    id: data.id,
    name: data.name,
    shortEffect:
      data.effect_entries.find((entry) => entry.language.name === 'en')?.short_effect ?? '',
  };
};
