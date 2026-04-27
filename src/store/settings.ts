import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

/**
 * Store for application settings.
 */
export const useSettingsStore = defineStore('settings-store', () => {
  const minimumAgeInMonthsRef = ref(0)

  function setMinimumAge(value: number) {
    minimumAgeInMonthsRef.value = value
  }

  const minimumAgeInMonths = computed(() => minimumAgeInMonthsRef.value)

  return { minimumAgeInMonths, setMinimumAge }
})
