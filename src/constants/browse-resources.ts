import { getItemSpriteUrl } from '@/constants/sprites';

export type BrowseResourceConfig = {
  resource: string;
  title: string;
  getImageUrl?: (name: string) => string;
};

export const BROWSE_RESOURCES: BrowseResourceConfig[] = [
  { resource: 'item', title: 'Items', getImageUrl: getItemSpriteUrl },
  { resource: 'move', title: 'Moves' },
  { resource: 'location', title: 'Locations' },
  { resource: 'encounter-method', title: 'Encounters' },
  { resource: 'contest-type', title: 'Contests' },
];
