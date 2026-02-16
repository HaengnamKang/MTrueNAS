import { useQuery } from '@tanstack/react-query';
import { useTrueNasClient } from './useTrueNasClient';
import { POLLING } from '../shared/utils/constants';

export function useNetworkInterfaces() {
  const client = useTrueNasClient();
  return useQuery({
    queryKey: ['network', 'interfaces'],
    queryFn: () => client.getNetworkInterfaces(),
    refetchInterval: POLLING.DISKS_MS,
    staleTime: 30_000,
  });
}
