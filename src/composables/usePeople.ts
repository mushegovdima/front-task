import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { peopleApi } from '@/services/people'
import type { Person } from '@/services/people'
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

export function useUpdatePersonAge() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ageInHours }: { id: number; ageInHours: number }) =>
      peopleApi.updateAge(id, ageInHours),
    onMutate: async ({ id, ageInHours }) => {
      await queryClient.cancelQueries({ queryKey: ['people'] })
      await queryClient.cancelQueries({ queryKey: ['people', { id }] })

      const previousPeople = queryClient.getQueryData<Person[]>(['people'])
      const previousPerson = queryClient.getQueryData<Person | undefined>(['people', { id }])

      queryClient.setQueryData<Person[]>(['people'], (old) =>
        old?.map((p) => (p.id === id ? { ...p, ageInHours } : p)) ?? []
      )
      queryClient.setQueryData<Person | undefined>(['people', { id }], (old) =>
        old ? { ...old, ageInHours } : old
      )

      return { previousPeople, previousPerson, id }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousPeople !== undefined) queryClient.setQueryData(['people'], context.previousPeople)
      if (context?.previousPerson !== undefined) queryClient.setQueryData(['people', { id: context.id }], context.previousPerson)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] })
    },
  })
}
