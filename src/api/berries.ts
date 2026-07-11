import type { PokeResourceItem } from '@/api/poke-resource';
import { parseIdFromUrl } from '@/api/pokemon';
import { POKEAPI_BASE_URL } from '@/constants/api';

export type BerryFlavor = {
  id: number;
  name: string;
  potency: number;
};

export type BerryDetail = {
  id: number;
  name: string;
  itemName: string;
  growthTime: number;
  maxHarvest: number;
  naturalGiftPower: number;
  naturalGiftType: string;
  size: number;
  smoothness: number;
  soilDryness: number;
  firmness: { id: number; name: string };
  flavors: BerryFlavor[];
};

type PokeApiBerryResponse = {
  id: number;
  name: string;
  item: { name: string };
  growth_time: number;
  max_harvest: number;
  natural_gift_power: number;
  natural_gift_type: { name: string };
  size: number;
  smoothness: number;
  soil_dryness: number;
  firmness: { name: string; url: string };
  flavors: { flavor: { name: string; url: string }; potency: number }[];
};

export const fetchBerryDetail = async (id: number): Promise<BerryDetail> => {
  const response = await fetch(`${POKEAPI_BASE_URL}/berry/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch berry ${id}: ${response.status}`);
  }

  const data: PokeApiBerryResponse = await response.json();

  return {
    id: data.id,
    name: data.name,
    itemName: data.item.name,
    growthTime: data.growth_time,
    maxHarvest: data.max_harvest,
    naturalGiftPower: data.natural_gift_power,
    naturalGiftType: data.natural_gift_type.name,
    size: data.size,
    smoothness: data.smoothness,
    soilDryness: data.soil_dryness,
    firmness: { id: parseIdFromUrl(data.firmness.url), name: data.firmness.name },
    flavors: data.flavors.map((entry) => ({
      id: parseIdFromUrl(entry.flavor.url),
      name: entry.flavor.name,
      potency: entry.potency,
    })),
  };
};

export type BerryCategoryKind = 'firmness' | 'flavor';

type PokeApiBerryFirmnessResponse = {
  name: string;
  berries: { name: string; url: string }[];
};

type PokeApiBerryFlavorResponse = {
  name: string;
  berries: { berry: { name: string; url: string }; potency: number }[];
};

export const fetchBerryCategory = async (
  kind: BerryCategoryKind,
  id: number,
): Promise<{ name: string; berries: PokeResourceItem[] }> => {
  const resource = kind === 'firmness' ? 'berry-firmness' : 'berry-flavor';
  const response = await fetch(`${POKEAPI_BASE_URL}/${resource}/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${resource} ${id}: ${response.status}`);
  }

  if (kind === 'firmness') {
    const data: PokeApiBerryFirmnessResponse = await response.json();
    return {
      name: data.name,
      berries: data.berries.map((entry) => ({
        id: parseIdFromUrl(entry.url),
        name: entry.name,
      })),
    };
  }

  const data: PokeApiBerryFlavorResponse = await response.json();
  return {
    name: data.name,
    berries: data.berries.map((entry) => ({
      id: parseIdFromUrl(entry.berry.url),
      name: entry.berry.name,
    })),
  };
};
