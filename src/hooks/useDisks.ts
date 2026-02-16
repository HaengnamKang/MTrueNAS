import { useQuery } from '@tanstack/react-query';
import { useTrueNasClient } from './useTrueNasClient';
import { POLLING } from '../shared/utils/constants';

export function useDisks() {
  const client = useTrueNasClient();
  return useQuery({
    queryKey: ['disks'],
    queryFn: () => client.getDisks(),
    refetchInterval: POLLING.DISKS_MS,
    staleTime: 30_000,
  });
}
