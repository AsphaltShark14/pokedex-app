import { useQuery } from '@tanstack/react-query';

import { fetchEvolutionChainById } from '@/api/pokemon';
import { usePokemonSpecies } from '@/api/use-pokemon-species';

export const useEvolutionChain = (pokemonId: number) => {
  const species = usePokemonSpecies(pokemonId);
  const evolutionChainId = species.data?.evolutionChainId;

  return useQuery({
    queryKey: ['evolution-chain', evolutionChainId],
    queryFn: () => fetchEvolutionChainById(evolutionChainId as number),
    enabled: evolutionChainId !== undefined,
  });
};
