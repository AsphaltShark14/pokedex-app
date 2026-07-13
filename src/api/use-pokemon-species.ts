import { useQuery } from '@tanstack/react-query';

import { fetchPokemonSpecies } from '@/api/pokemon-species';

export const usePokemonSpecies = (id: number) => {
  return useQuery({
    queryKey: ['pokemon-species', id],
    queryFn: () => fetchPokemonSpecies(id),
  });
};
