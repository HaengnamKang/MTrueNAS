import { useQuery } from '@tanstack/react-query';
import { useTrueNasClient } from './useTrueNasClient';
import { POLLING } from '../shared/utils/constants';

export function useSystemInfo() {
  const client = useTrueNasClient();
  return useQuery({
    queryKey: ['system', 'info'],
    queryFn: () => client.getSystemInfo(),
    refetchInterval: POLLING.SYSTEM_INFO_MS,
    staleTime: 10_000,
  });
}
