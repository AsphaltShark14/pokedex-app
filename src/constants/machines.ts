import type { MachineMoveEntry } from '@/api/machines';

export const ALL_MACHINES_CATEGORY_ID = 37;

export const isHiddenMachine = (name: string): boolean => name.startsWith('hm');
export const isTechnicalMachine = (name: string): boolean => name.startsWith('tm');

export const formatMachineLabel = (name: string): string =>
  name.replace(/^(tm|hm)/, (prefix) => prefix.toUpperCase());

export const TM_BLURB =
  'TMs (Technical Machines) teach a compatible Pokémon a move. In the most recent games they can be crafted and used more than once, after being single-use for many generations.';

export const HM_BLURB =
  "HMs (Hidden Machines) teach a move permanently — it can't be forgotten without a Move Deleter. They were tied to overworld traversal (Surf, Fly, Strength...) and were retired starting in Generation VII.";

export type MachineMoveGroup = {
  moveId: number;
  moveName: string;
  versionGroups: string[];
};

export const groupConsecutiveMoves = (entries: MachineMoveEntry[]): MachineMoveGroup[] => {
  const groups: MachineMoveGroup[] = [];

  for (const entry of entries) {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.moveId === entry.moveId) {
      lastGroup.versionGroups.push(entry.versionGroupName);
      continue;
    }
    groups.push({
      moveId: entry.moveId,
      moveName: entry.moveName,
      versionGroups: [entry.versionGroupName],
    });
  }

  return groups;
};
