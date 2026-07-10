import { useQuery } from '@tanstack/react-query';

import { fetchPokemonList } from '@/api/pokemon';

const SEARCH_INDEX_LIMIT = 2000;

export const usePokemonSearchIndex = () => {
  return useQuery({
    queryKey: ['pokemon-search-index'],
    queryFn: () => fetchPokemonList(SEARCH_INDEX_LIMIT),
    staleTime: Infinity,
  });
};
