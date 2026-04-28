<script setup lang="ts">
import { computed } from 'vue'
import { usePeople } from '@/composables/usePeople'
import Avatar from '@/shared/components/Avatar.vue'

const { data: people, isPending, isError } = usePeople()

const peopleWithYears = computed(() =>
  (people.value ?? []).map((person) => ({
    ...person,
    ageInYears: Math.floor(person.ageInHours / 8760),
  })),
)
</script>

<template>
  <div class="flex flex-col gap-4">
    <h1 class="text-xl font-bold text-gray-700">People</h1>

    <div v-if="isPending" class="text-gray-400 text-sm">Loading...</div>
    <div v-else-if="isError" class="text-red-500 text-sm">Failed to load people</div>
    <div v-else class="flex flex-col gap-3">
      <router-link
        v-for="person in peopleWithYears"
        :key="person.id"
        :to="`/person/${person.id}`"
        class="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-violet-500"
      >
        <Avatar src="/img.png" :alt="person.name" :size="40" />
        <div>
          <div class="font-bold text-gray-700">{{ person.name }}</div>
          <div class="text-gray-600">{{ person.ageInYears }} years old</div>
        </div>
      </router-link>
    </div>

    <router-link to="/settings" class="text-violet-600 hover:underline text-sm">
      Settings
    </router-link>
  </div>
</template>
