import { useQuery } from '@tanstack/react-query';

import { fetchPokemonList } from '@/api/pokemon';

const POKEMON_LIST_LIMIT = 20;

export const usePokemonList = () => {
  return useQuery({
    queryKey: ['pokemon-list', POKEMON_LIST_LIMIT],
    queryFn: () => fetchPokemonList(POKEMON_LIST_LIMIT),
  });
};
