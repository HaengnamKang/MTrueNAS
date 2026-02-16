import { useQuery } from '@tanstack/react-query';
import { useTrueNasClient } from './useTrueNasClient';
import { POLLING } from '../shared/utils/constants';

export function usePools() {
  const client = useTrueNasClient();
  return useQuery({
    queryKey: ['pools'],
    queryFn: () => client.getPools(),
    refetchInterval: POLLING.POOLS_MS,
    staleTime: 30_000,
  });
}
