import { useQuery } from '@tanstack/react-query';
import { useTrueNasClient } from './useTrueNasClient';
import { POLLING } from '../shared/utils/constants';

export function useServices() {
  const client = useTrueNasClient();
  return useQuery({
    queryKey: ['services'],
    queryFn: () => client.getServices(),
    refetchInterval: POLLING.SERVICES_MS,
    staleTime: 30_000,
  });
}
