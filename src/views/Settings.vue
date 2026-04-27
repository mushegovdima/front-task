<script setup lang="ts">
import NumberField from '@/shared/components/NumberField.vue'
import { useSettingsStore } from '@/store/settings'
import { storeToRefs } from 'pinia'

const settings = useSettingsStore()
const { minimumAgeInMonths } = storeToRefs(settings)

function updateMinimumAge(value: number | undefined) {
  settings.setMinimumAge(value ?? 0)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <router-link to="/" class="text-violet-600 hover:underline text-sm">&larr; Back</router-link>

    <h1 class="text-xl font-bold text-gray-700">Settings</h1>

    <div>
      <number-field
        :model-value="minimumAgeInMonths"
        label="Minimum Age"
        placeholder="0"
        caption="months"
        @update:model-value="updateMinimumAge"
      />
    </div>
  </div>
</template>
