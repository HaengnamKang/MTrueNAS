import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTrueNasClient } from './useTrueNasClient';

export function useSnapshots(datasetId?: string) {
  const client = useTrueNasClient();
  return useQuery({
    queryKey: ['snapshots', datasetId],
    queryFn: () => client.getSnapshots(datasetId),
    staleTime: 30_000,
  });
}

export function useCreateSnapshot() {
  const client = useTrueNasClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { dataset: string; name: string; recursive?: boolean }) =>
      client.createSnapshot(params.dataset, params.name, params.recursive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snapshots'] });
    },
  });
}

export function useDeleteSnapshot() {
  const client = useTrueNasClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => client.deleteSnapshot(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snapshots'] });
    },
  });
}
