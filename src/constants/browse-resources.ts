import { getBerrySpriteUrl } from '@/constants/sprites';

export type BrowseResourceConfig = {
  resource: string;
  title: string;
  getImageUrl?: (name: string) => string;
};

export const BROWSE_RESOURCES: BrowseResourceConfig[] = [
  { resource: 'berry', title: 'Berries', getImageUrl: getBerrySpriteUrl },
  { resource: 'move', title: 'Moves' },
  { resource: 'location', title: 'Locations' },
  { resource: 'encounter-method', title: 'Encounters' },
  { resource: 'contest-type', title: 'Contests' },
];
