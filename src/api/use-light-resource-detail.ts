import { useQuery } from '@tanstack/react-query';

import {
  fetchContestTypeDetail,
  fetchEncounterMethodDetail,
  fetchVersionDetail,
} from '@/api/light-resources';

export const useContestTypeDetail = (id: number) => {
  return useQuery({
    queryKey: ['contest-type-detail', id],
    queryFn: () => fetchContestTypeDetail(id),
  });
};

export const useEncounterMethodDetail = (id: number) => {
  return useQuery({
    queryKey: ['encounter-method-detail', id],
    queryFn: () => fetchEncounterMethodDetail(id),
  });
};

export const useVersionDetail = (id: number) => {
  return useQuery({
    queryKey: ['version-detail', id],
    queryFn: () => fetchVersionDetail(id),
  });
};
