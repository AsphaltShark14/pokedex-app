import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';

import type { MachineHistoryEntry } from '@/api/items';
import { fetchMachineById } from '@/api/machines';
import { groupConsecutiveMoves } from '@/constants/machines';

export const useMachineMoveHistory = (machineHistory: MachineHistoryEntry[]) => {
  const results = useQueries({
    queries: machineHistory.map((entry) => ({
      queryKey: ['machine-detail', entry.machineId],
      queryFn: () => fetchMachineById(entry.machineId),
      staleTime: Infinity,
    })),
  });

  const isLoading = results.some((result) => result.isLoading);
  const isError = results.some((result) => result.isError);

  const groups = useMemo(() => {
    const entries = results.map((result) => result.data).filter((data) => data !== undefined);
    return groupConsecutiveMoves(entries);
  }, [results]);

  return { groups, isLoading, isError };
};
