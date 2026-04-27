<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue'
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
  /** Optional avatar to display next to the input */
  avatar?: {
    /** The source URL of the avatar image */
    src: string
    /** Alternative text for the avatar image */
    alt?: string
  }
}
const vImask = IMaskDirective

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [number | undefined]
}>()

const isFocused = ref(false)
const sizerValue = ref('')
const inputRef = ref<HTMLInputElement>()

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

watch(() => props.modelValue, async() => {
  await nextTick()
  sizerValue.value = inputRef.value?.value ?? ''
},
{ immediate: true })
</script>

<template>
  <div class="number-field">
    <div v-if="avatar" class="number-field--avatar-wrapper">
      <div class="number-field--avatar-border" :class="{ 'number-field--avatar-border--focused': isFocused }" />
      <img
        :src="avatar.src"
        :alt="avatar.alt"
        class="number-field--avatar"
      />
    </div>
    <div class="number-field--body">
      <div class="number-field--label" :class="{ 'number-field--label--focused': isFocused }">{{ label }}</div>
      <div class="number-field--input-row">
        <div class="number-field--input-sizer" :data-value="sizerValue || placeholder || ''">
          <input
            ref="inputRef"
            v-imask="maskOptions"
            :value="modelValue"
            size="1"
            type="text"
            inputmode="numeric"
            :placeholder="placeholder"
            @accept="onAccept"
            @focusin="setFocus(true)"
            @focusout="setFocus(false)"
            class="number-field--input"
            :class="{ 'number-field--input--focused': isFocused }"
          />
        </div>
        <span v-if="caption" class="number-field--caption">{{ caption }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.number-field {
  --dark-color: #1E0E4C;
  --primary-color: #3D06D7;
  --primary-light-color: #906FEE;
  --light-grey-color: #CFCADF;
  --mid-grey-color: #AA9DCE;

  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  border-radius: 5px;
}

.number-field--avatar-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  flex: none;
  overflow: visible;
}

.number-field--avatar-border {
  box-sizing: border-box;
  position: absolute;
  width: 88px;
  height: 88px;
  left: calc(50% - 44px);
  top: calc(50% - 44px);
  border-radius: 9999px;
  border: 1px solid transparent;
  pointer-events: none;
}

.number-field--avatar-border--focused {
  border-color: var(--primary-color);
}

.number-field--avatar {
  position: absolute;
  width: 80px;
  height: 80px;
  left: calc(50% - 40px);
  top: calc(50% - 40px);
  border-radius: 9999px;
  object-fit: cover;
}

.number-field--body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  flex: none;
}

.number-field--label {
  font-family: 'Koulen', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 15px;
  letter-spacing: 0.02em;
  color: var(--dark-color);
}

.number-field--label--focused {
  color: var(--primary-color);
}

.number-field--input-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
}

.number-field--input-sizer {
  display: inline-grid;
  min-width: 72px;
  width: fit-content;
}

.number-field--input-sizer::after {
  content: attr(data-value);
  visibility: hidden;
  white-space: pre;
  grid-area: 1 / 1;
  box-sizing: border-box;
  padding: 8px 16px 8px 8px;
  height: 44px;
  border: 1px solid transparent;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;
}

.number-field--input {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 8px 16px 8px 8px;
  grid-area: 1 / 1;
  min-width: 0;
  height: 44px;
  border: 1px solid var(--light-grey-color);
  border-radius: 6px;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;
  color: var(--dark-color);
  outline: none;
}

.number-field--input:hover {
  border-color: var(--mid-grey-color);
}

.number-field--input:focus {
  border: 1.5px solid var(--primary-light-color);
  caret-color: var(--primary-color);
  color: var(--dark-color);
}

.number-field--input::placeholder {
  opacity: 0.3;
}

.number-field--input--focused {
  border: 1.5px solid var(--primary-light-color);
}

.number-field--caption {
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 22px;
  color: var(--dark-color);
}
</style>
