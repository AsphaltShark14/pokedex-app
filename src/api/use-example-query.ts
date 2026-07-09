import { useQuery } from '@tanstack/react-query';

import { fetchExampleItems } from '@/api/example';

export function useExampleQuery() {
  return useQuery({
    queryKey: ['example-items'],
    queryFn: fetchExampleItems,
  });
}
