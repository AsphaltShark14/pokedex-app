import type { PokeResourceItem } from '@/api/poke-resource';
import { parseIdFromUrl } from '@/api/pokemon';
import { POKEAPI_BASE_URL } from '@/constants/api';

const MAX_LEARNED_BY_POKEMON = 30;

export type MoveDetail = {
  id: number;
  name: string;
  type: string;
  power: number | null;
  pp: number | null;
  accuracy: number | null;
  priority: number;
  damageClass: string;
  target: string;
  generation: string;
  shortEffect: string;
  learnedByPokemon: PokeResourceItem[];
};

type PokeApiMoveResponse = {
  id: number;
  name: string;
  power: number | null;
  pp: number | null;
  accuracy: number | null;
  priority: number;
  type: { name: string };
  damage_class: { name: string };
  target: { name: string };
  generation: { name: string };
  effect_entries: { short_effect: string; language: { name: string } }[];
  learned_by_pokemon: { name: string; url: string }[];
};

export const fetchMoveDetail = async (id: number): Promise<MoveDetail> => {
  const response = await fetch(`${POKEAPI_BASE_URL}/move/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch move ${id}: ${response.status}`);
  }

  const data: PokeApiMoveResponse = await response.json();

  const englishEffect = data.effect_entries.find((entry) => entry.language.name === 'en');

  return {
    id: data.id,
    name: data.name,
    type: data.type.name,
    power: data.power,
    pp: data.pp,
    accuracy: data.accuracy,
    priority: data.priority,
    damageClass: data.damage_class.name,
    target: data.target.name,
    generation: data.generation.name,
    shortEffect: englishEffect?.short_effect ?? '',
    learnedByPokemon: data.learned_by_pokemon.slice(0, MAX_LEARNED_BY_POKEMON).map((pokemon) => ({
      id: parseIdFromUrl(pokemon.url),
      name: pokemon.name,
    })),
  };
};
