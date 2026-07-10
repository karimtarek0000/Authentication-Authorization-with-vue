<script setup lang="ts">
import { authChannel } from '@/auth'
import { onMounted } from 'vue'

onMounted(() => {
  authChannel.subscribe(event => {
    if (event === 'logout') {
      location.reload()
    }
  })
})
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
