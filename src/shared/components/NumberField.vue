<script lang="ts" setup>
import { computed, nextTick, ref, useId, watch } from 'vue'
import { IMaskDirective } from 'vue-imask'

interface Props {
  /** The value of the number field */
  modelValue: number | undefined
  /** The label of the number field */
  label: string
  /** The caption (a short description or unit) */
  caption?: string
  /** Placeholder text for the input */
  placeholder?: string
  /** Minimum allowed value */
  min?: number
  /** Maximum allowed value */
  max?: number
}

const vImask = IMaskDirective

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [number | undefined]
}>()

const isFocused = ref(false)
const sizerValue = ref('')
const inputRef = ref<HTMLInputElement>()
const inputId = useId()

const maskOptions = computed(() => ({
  mask: Number,
  thousandsSeparator: ' ',
  normalizeZeros: false,
  min: props.min,
  max: props.max,
}))

const setFocus = (focused: boolean) => {
  isFocused.value = focused
}

const onAccept = (e: CustomEvent) => {
  sizerValue.value = e.detail.value
  const value = e.detail.value === '' ? undefined : e.detail.typedValue as number
  emit('update:modelValue', value)
}

watch(() => props.modelValue, async () => {
  await nextTick()
  sizerValue.value = inputRef.value?.value ?? ''
}, { immediate: true })
</script>

<template>
  <div class="relative flex flex-row items-center gap-4 rounded">
    <slot name="prepend" :isFocused="isFocused" />

    <label
        :for="inputId"
        class="flex flex-col items-start gap-3 shrink-0"
      >
        <span
          class="cursor-pointer font-['Koulen'] font-normal text-base leading-3.75 tracking-[0.02em] transition-colors"
          :class="isFocused ? 'text-(--color-primary)' : 'text-(--color-dark)'"
        >{{ label }}</span>

        <div class="flex flex-row items-center gap-3">
          <div
            class="number-field-sizer inline-grid min-w-18 w-fit after:content-[attr(data-value)] after:invisible after:whitespace-pre after:[grid-area:1/1] after:box-border after:py-2 after:pl-2 after:pr-4 after:h-11 after:border-[1.5px] after:border-transparent after:font-['Inter'] after:font-medium after:text-lg after:leading-5.5"
            :data-value="sizerValue || placeholder || ''"
          >
            <input
              :id="inputId"
              ref="inputRef"
              v-imask="maskOptions"
              :value="modelValue"
              size="1"
              type="text"
              inputmode="numeric"
              :placeholder="placeholder"
              class="box-border py-2 pl-2 pr-4 [grid-area:1/1] min-w-0 h-11 border-[1.5px] rounded-md font-['Inter'] font-medium text-lg leading-5.5 text-(--color-dark) outline-none transition-colors hover:border-(--color-border-hover) focus:border-(--color-primary-light) focus:caret-(--color-primary) placeholder:opacity-30"
              :class="isFocused ? 'border-(--color-primary-light)' : 'border-(--color-border)'"
              @accept="onAccept"
              @focusin="setFocus(true)"
              @focusout="setFocus(false)"
            />
          </div>
          <span v-if="caption" class="font-['Inter'] font-normal text-lg leading-5.5 text-(--color-dark)">
            {{ caption }}
          </span>
        </div>
      </label>
  </div>
</template>
