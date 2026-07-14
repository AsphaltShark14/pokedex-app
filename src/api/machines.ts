import { formatName, parseIdFromUrl } from '@/api/pokemon';
import { POKEAPI_BASE_URL } from '@/constants/api';

export type MachineMoveEntry = {
  versionGroupName: string;
  moveId: number;
  moveName: string;
};

type PokeApiMachineResponse = {
  move: { name: string; url: string };
  version_group: { name: string };
};

export const fetchMachineById = async (machineId: number): Promise<MachineMoveEntry> => {
  const response = await fetch(`${POKEAPI_BASE_URL}/machine/${machineId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch machine ${machineId}: ${response.status}`);
  }

  const data: PokeApiMachineResponse = await response.json();

  return {
    versionGroupName: formatName(data.version_group.name),
    moveId: parseIdFromUrl(data.move.url),
    moveName: formatName(data.move.name),
  };
};
