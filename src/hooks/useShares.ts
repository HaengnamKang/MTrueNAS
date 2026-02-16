import { useQuery } from '@tanstack/react-query';
import { useTrueNasClient } from './useTrueNasClient';

export function useSmbShares() {
  const client = useTrueNasClient();
  return useQuery({
    queryKey: ['shares', 'smb'],
    queryFn: () => client.getSmbShares(),
    staleTime: 60_000,
  });
}

export function useNfsShares() {
  const client = useTrueNasClient();
  return useQuery({
    queryKey: ['shares', 'nfs'],
    queryFn: () => client.getNfsShares(),
    staleTime: 60_000,
  });
}
