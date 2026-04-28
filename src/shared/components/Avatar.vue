<script setup lang="ts">
interface Props {
  src: string
  alt?: string
  size: number
  highlighted?: boolean
}

defineProps<Props>()
</script>

<template>
  <div
    class="relative shrink-0 overflow-visible"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <div
      v-if="highlighted"
      class="box-border absolute -inset-1 rounded-full border pointer-events-none border-(--color-primary)"
    />
    <img
      :src="src"
      :alt="alt"
      class="absolute inset-0 w-full h-full rounded-full object-cover"
    />
  </div>
</template>
