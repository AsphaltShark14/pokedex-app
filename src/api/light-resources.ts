import { parseIdFromUrl } from '@/api/pokemon';
import { POKEAPI_BASE_URL } from '@/constants/api';

export type ContestTypeDetail = {
  id: number;
  name: string;
  berryFlavor: { id: number; name: string } | null;
};

type PokeApiContestTypeResponse = {
  id: number;
  name: string;
  berry_flavor: { name: string; url: string } | null;
};

export const fetchContestTypeDetail = async (id: number): Promise<ContestTypeDetail> => {
  const response = await fetch(`${POKEAPI_BASE_URL}/contest-type/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch contest-type ${id}: ${response.status}`);
  }

  const data: PokeApiContestTypeResponse = await response.json();

  return {
    id: data.id,
    name: data.name,
    berryFlavor: data.berry_flavor
      ? { id: parseIdFromUrl(data.berry_flavor.url), name: data.berry_flavor.name }
      : null,
  };
};

export type EncounterMethodDetail = {
  id: number;
  name: string;
  order: number;
};

type PokeApiEncounterMethodResponse = {
  id: number;
  name: string;
  order: number;
};

export const fetchEncounterMethodDetail = async (id: number): Promise<EncounterMethodDetail> => {
  const response = await fetch(`${POKEAPI_BASE_URL}/encounter-method/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch encounter-method ${id}: ${response.status}`);
  }

  const data: PokeApiEncounterMethodResponse = await response.json();

  return { id: data.id, name: data.name, order: data.order };
};

export type VersionDetail = {
  id: number;
  name: string;
  versionGroupName: string;
};

type PokeApiVersionResponse = {
  id: number;
  name: string;
  version_group: { name: string };
};

export const fetchVersionDetail = async (id: number): Promise<VersionDetail> => {
  const response = await fetch(`${POKEAPI_BASE_URL}/version/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch version ${id}: ${response.status}`);
  }

  const data: PokeApiVersionResponse = await response.json();

  return { id: data.id, name: data.name, versionGroupName: data.version_group.name };
};
