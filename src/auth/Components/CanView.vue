<script setup lang="ts">
defineProps<{
  status: boolean
}>()
</script>

<template>
  <slot v-if="status" />
  <slot v-else name="title">
    <h3>You not authorized to view this section</h3>
  </slot>
</template>

<style scoped></style>
