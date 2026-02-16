import { useQuery } from '@tanstack/react-query';
import { useTrueNasClient } from './useTrueNasClient';

export function useDatasets() {
  const client = useTrueNasClient();
  return useQuery({
    queryKey: ['datasets'],
    queryFn: () => client.getDatasets(),
    staleTime: 30_000,
  });
}

export function useDatasetsByPool(poolName: string) {
  const client = useTrueNasClient();
  return useQuery({
    queryKey: ['datasets', poolName],
    queryFn: () => client.getDatasetsByPool(poolName),
    staleTime: 30_000,
    enabled: !!poolName,
  });
}
