import { useQuery } from '@tanstack/react-query';

import { fetchPokemonEncounters } from '@/api/pokemon-encounters';

export const usePokemonEncounters = (id: number) => {
  return useQuery({
    queryKey: ['pokemon-encounters', id],
    queryFn: () => fetchPokemonEncounters(id),
  });
};
