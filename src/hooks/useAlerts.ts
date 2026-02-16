import { useQuery } from '@tanstack/react-query';
import { useTrueNasClient } from './useTrueNasClient';
import { POLLING } from '../shared/utils/constants';

export function useAlerts() {
  const client = useTrueNasClient();
  return useQuery({
    queryKey: ['alerts'],
    queryFn: () => client.getAlerts(),
    refetchInterval: POLLING.ALERTS_MS,
    staleTime: 10_000,
  });
}
