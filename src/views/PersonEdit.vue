<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePerson, useUpdatePersonAge } from '@/composables/usePeople'
import NumberField from '@/shared/components/NumberField.vue'
import samuelImg from '@/assets/samuel.png'
import type { Person } from '@/services/people'
import Avatar from '@/shared/components/Avatar.vue'

const route = useRoute()
const router = useRouter()
const personId = computed(() => Number(route.params.id))

const { data: person, isPending, isError } = usePerson(personId)
const { mutate: updateAge, isPending: isSaving, error: saveError } = useUpdatePersonAge()
const localPerson = ref<Person | null>(null)

const save = () => {
  if (!localPerson.value) return
  updateAge(
    { id: personId.value, ageInHours: localPerson.value.ageInHours },
    { onSuccess: () => { router.push({ name: 'people' }) }}
  )
}

const handleUpdateAge = (ageInHours: number | undefined) => {
  if (!localPerson.value) return
  localPerson.value.ageInHours = ageInHours ?? 0
}

watch(person, (newPerson) => {
  if (newPerson) {
    localPerson.value = { ...newPerson }
  }
}, { immediate: true })
</script>

<template>
  <div v-if="isPending" class="text-gray-400 text-sm">Loading...</div>
  <div v-else-if="isError" class="text-red-500 text-sm">Failed to load person</div>
  <div v-else-if="localPerson" class="flex flex-col gap-4">
    <router-link to="/" class="text-violet-600 hover:underline text-sm">&larr; Back</router-link>
    <number-field
      :model-value="localPerson.ageInHours"
      :label="localPerson.name"
      placeholder="7"
      caption="hours old"
      @update:model-value="handleUpdateAge"
    >
      <template #prepend="{ isFocused }">
        <avatar
          :src="samuelImg"
          :alt="localPerson.name"
          :size="80"
          :highlighted="isFocused"
        />
      </template>

    </number-field>
    <button
      class="px-6 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
      :class="isSaving
        ? 'bg-violet-300 text-white cursor-not-allowed'
        : 'bg-violet-600 text-white hover:bg-violet-700 active:bg-violet-800'"
      :disabled="isSaving"
      @click="save"
    >
      {{ isSaving ? 'Saving...' : 'Save' }}
    </button>
    <p v-if="saveError" class="text-red-500 text-sm">{{ saveError.message }}</p>
  </div>

  <div v-else>
    <p class="text-gray-600">Person not found</p>
    <router-link to="/" class="text-violet-600 hover:underline text-sm">Back to list</router-link>
  </div>
</template>
