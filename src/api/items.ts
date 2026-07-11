import type { PokeResourceItem } from '@/api/poke-resource';
import { parseIdFromUrl } from '@/api/pokemon';
import { POKEAPI_BASE_URL } from '@/constants/api';

export type ItemAttribute = {
  id: number;
  name: string;
};

export type ItemDetail = {
  id: number;
  name: string;
  cost: number;
  flingPower: number | null;
  flingEffect: string | null;
  shortEffect: string;
  category: { id: number; name: string };
  attributes: ItemAttribute[];
  heldByPokemon: PokeResourceItem[];
};

type PokeApiItemResponse = {
  id: number;
  name: string;
  cost: number;
  fling_power: number | null;
  fling_effect: { name: string } | null;
  category: { name: string; url: string };
  attributes: { name: string; url: string }[];
  effect_entries: { effect: string; short_effect: string; language: { name: string } }[];
  held_by_pokemon: { pokemon: { name: string; url: string } }[];
};

export const fetchItemDetail = async (id: number): Promise<ItemDetail> => {
  const response = await fetch(`${POKEAPI_BASE_URL}/item/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch item ${id}: ${response.status}`);
  }

  const data: PokeApiItemResponse = await response.json();

  const englishEffect = data.effect_entries.find((entry) => entry.language.name === 'en');

  const heldByPokemon: PokeResourceItem[] = [];
  const seenIds = new Set<number>();
  for (const entry of data.held_by_pokemon) {
    const pokemonId = parseIdFromUrl(entry.pokemon.url);
    if (!seenIds.has(pokemonId)) {
      seenIds.add(pokemonId);
      heldByPokemon.push({ id: pokemonId, name: entry.pokemon.name });
    }
  }

  return {
    id: data.id,
    name: data.name,
    cost: data.cost,
    flingPower: data.fling_power,
    flingEffect: data.fling_effect?.name ?? null,
    shortEffect: englishEffect?.short_effect ?? '',
    category: { id: parseIdFromUrl(data.category.url), name: data.category.name },
    attributes: data.attributes.map((attribute) => ({
      id: parseIdFromUrl(attribute.url),
      name: attribute.name,
    })),
    heldByPokemon,
  };
};

export type ItemFilterKind = 'item-category' | 'item-attribute';

type PokeApiItemFilterResponse = {
  name: string;
  items: { name: string; url: string }[];
};

export const fetchItemFilterCategory = async (
  kind: ItemFilterKind,
  id: number,
): Promise<{ name: string; items: PokeResourceItem[] }> => {
  const response = await fetch(`${POKEAPI_BASE_URL}/${kind}/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${kind} ${id}: ${response.status}`);
  }

  const data: PokeApiItemFilterResponse = await response.json();

  return {
    name: data.name,
    items: data.items.map((entry) => ({
      id: parseIdFromUrl(entry.url),
      name: entry.name,
    })),
  };
};
