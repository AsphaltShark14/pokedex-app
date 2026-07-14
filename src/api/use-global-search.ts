import type { PokeResourceItem } from '@/api/poke-resource';
import { useResourceSearchIndex } from '@/api/use-resource-search-index';

const MAX_RESULTS_PER_CATEGORY = 5;

export type DetailPathname =
  | '/details/[id]'
  | '/items/[id]'
  | '/berries/[id]'
  | '/locations/[id]'
  | '/moves/[id]'
  | '/contests/[id]'
  | '/encounters/[id]'
  | '/games/[id]';

export type GlobalSearchCategory = {
  title: string;
  pathname: DetailPathname;
  items: PokeResourceItem[];
};

export type QuickLinkPathname =
  | '/pokemon-list'
  | '/items'
  | '/berries'
  | '/locations'
  | '/moves'
  | '/contests'
  | '/encounters'
  | '/games';

export const SEARCH_QUICK_LINKS: { title: string; href: QuickLinkPathname }[] = [
  { title: 'Pokémon', href: '/pokemon-list' },
  { title: 'Items', href: '/items' },
  { title: 'Berries', href: '/berries' },
  { title: 'Locations', href: '/locations' },
  { title: 'Moves', href: '/moves' },
  { title: 'Contests', href: '/contests' },
  { title: 'Encounters', href: '/encounters' },
  { title: 'Games', href: '/games' },
];

const filterResults = (
  title: string,
  pathname: DetailPathname,
  data: { items: PokeResourceItem[] } | undefined,
  trimmedQuery: string,
): GlobalSearchCategory => ({
  title,
  pathname,
  items: (data?.items ?? [])
    .filter((item) => item.name.includes(trimmedQuery))
    .slice(0, MAX_RESULTS_PER_CATEGORY),
});

export const useGlobalSearch = (debouncedQuery: string): GlobalSearchCategory[] => {
  const hasQuery = debouncedQuery.trim().length > 0;
  const trimmedQuery = debouncedQuery.trim().toLowerCase();

  const pokemon = useResourceSearchIndex('pokemon', hasQuery);
  const items = useResourceSearchIndex('item', hasQuery);
  const berries = useResourceSearchIndex('berry', hasQuery);
  const locations = useResourceSearchIndex('location', hasQuery);
  const moves = useResourceSearchIndex('move', hasQuery);
  const contests = useResourceSearchIndex('contest-type', hasQuery);
  const encounters = useResourceSearchIndex('encounter-method', hasQuery);
  const games = useResourceSearchIndex('version', hasQuery);

  if (!hasQuery) {
    return [];
  }

  return [
    filterResults('Pokémon', '/details/[id]', pokemon.data, trimmedQuery),
    filterResults('Items', '/items/[id]', items.data, trimmedQuery),
    filterResults('Berries', '/berries/[id]', berries.data, trimmedQuery),
    filterResults('Locations', '/locations/[id]', locations.data, trimmedQuery),
    filterResults('Moves', '/moves/[id]', moves.data, trimmedQuery),
    filterResults('Contests', '/contests/[id]', contests.data, trimmedQuery),
    filterResults('Encounters', '/encounters/[id]', encounters.data, trimmedQuery),
    filterResults('Games', '/games/[id]', games.data, trimmedQuery),
  ].filter((category) => category.items.length > 0);
};
