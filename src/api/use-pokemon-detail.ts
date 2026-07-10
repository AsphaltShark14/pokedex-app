import { useQuery } from '@tanstack/react-query';

import { fetchPokemonDetail } from '@/api/pokemon';

export const usePokemonDetail = (id: number) => {
  return useQuery({
    queryKey: ['pokemon-detail', id],
    queryFn: () => fetchPokemonDetail(id),
  });
};
