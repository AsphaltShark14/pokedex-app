import { parseIdFromUrl } from '@/api/pokemon';
import { POKEAPI_BASE_URL } from '@/constants/api';

export type PokeResourceItem = {
  id: number;
  name: string;
};

type PokeApiListResponse = {
  next: string | null;
  results: { name: string; url: string }[];
};

type FetchResourceListParams = {
  limit: number;
  offset: number;
};

export const fetchResourceList = async (
  resource: string,
  { limit, offset }: FetchResourceListParams,
): Promise<{ items: PokeResourceItem[]; hasMore: boolean }> => {
  const response = await fetch(`${POKEAPI_BASE_URL}/${resource}?limit=${limit}&offset=${offset}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${resource} list: ${response.status}`);
  }

  const data: PokeApiListResponse = await response.json();

  return {
    items: data.results.map((entry) => ({
      id: parseIdFromUrl(entry.url),
      name: entry.name,
    })),
    hasMore: data.next !== null,
  };
};
