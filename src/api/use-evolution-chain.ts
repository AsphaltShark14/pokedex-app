import { useQuery } from '@tanstack/react-query';

import { fetchEvolutionChain } from '@/api/pokemon';

export const useEvolutionChain = (id: number) => {
  return useQuery({
    queryKey: ['evolution-chain', id],
    queryFn: () => fetchEvolutionChain(id),
  });
};
