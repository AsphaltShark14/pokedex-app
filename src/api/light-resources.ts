import { parseIdFromUrl } from '@/api/pokemon';
import { POKEAPI_BASE_URL } from '@/constants/api';

type PokeApiName = {
  language: { name: string };
  name: string;
};

const findEnglishName = (names: PokeApiName[]): string | undefined =>
  names.find((entry) => entry.language.name === 'en')?.name;

export type ContestTypeDetail = {
  id: number;
  name: string;
  color: string | null;
  berryFlavor: { id: number; name: string } | null;
};

type PokeApiContestTypeResponse = {
  id: number;
  name: string;
  berry_flavor: { name: string; url: string } | null;
  names: (PokeApiName & { color: string })[];
};

export const fetchContestTypeDetail = async (id: number): Promise<ContestTypeDetail> => {
  const response = await fetch(`${POKEAPI_BASE_URL}/contest-type/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch contest-type ${id}: ${response.status}`);
  }

  const data: PokeApiContestTypeResponse = await response.json();
  const englishName = data.names.find((entry) => entry.language.name === 'en');

  return {
    id: data.id,
    name: data.name,
    color: englishName?.color ?? null,
    berryFlavor: data.berry_flavor
      ? { id: parseIdFromUrl(data.berry_flavor.url), name: data.berry_flavor.name }
      : null,
  };
};

export type EncounterMethodDetail = {
  id: number;
  name: string;
  order: number;
  description: string;
};

type PokeApiEncounterMethodResponse = {
  id: number;
  name: string;
  order: number;
  names: PokeApiName[];
};

export const fetchEncounterMethodDetail = async (id: number): Promise<EncounterMethodDetail> => {
  const response = await fetch(`${POKEAPI_BASE_URL}/encounter-method/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch encounter-method ${id}: ${response.status}`);
  }

  const data: PokeApiEncounterMethodResponse = await response.json();

  return {
    id: data.id,
    name: data.name,
    order: data.order,
    description: findEnglishName(data.names) ?? '',
  };
};

export type VersionDetail = {
  id: number;
  name: string;
  versionGroupName: string;
  generation: string;
  region: string | null;
};

type PokeApiVersionResponse = {
  id: number;
  name: string;
  version_group: { name: string; url: string };
};

type PokeApiVersionGroupResponse = {
  generation: { name: string };
  regions: { name: string }[];
};

export const fetchVersionDetail = async (id: number): Promise<VersionDetail> => {
  const response = await fetch(`${POKEAPI_BASE_URL}/version/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch version ${id}: ${response.status}`);
  }

  const data: PokeApiVersionResponse = await response.json();

  const versionGroupResponse = await fetch(data.version_group.url);
  if (!versionGroupResponse.ok) {
    throw new Error(`Failed to fetch version-group: ${versionGroupResponse.status}`);
  }
  const versionGroup: PokeApiVersionGroupResponse = await versionGroupResponse.json();

  return {
    id: data.id,
    name: data.name,
    versionGroupName: data.version_group.name,
    generation: versionGroup.generation.name,
    region: versionGroup.regions[0]?.name ?? null,
  };
};
