import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { peopleApi } from '@/services/people'
import type { MaybeRef } from 'vue'
import { toValue } from 'vue'

export function usePeople() {
  return useQuery({
    queryKey: ['people'],
    queryFn: peopleApi.getAll,
  })
}

export function usePerson(id: MaybeRef<number>) {
  return useQuery({
    queryKey: ['people', { id }],
    queryFn: () => peopleApi.getById(toValue(id)),
  })
}

export function useUpdatePersonAge(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ageInHours }: { id: number; ageInHours: number }) =>
      peopleApi.updateAge(id, ageInHours),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] })
      if (onSuccess) onSuccess()
    },
  })
}
