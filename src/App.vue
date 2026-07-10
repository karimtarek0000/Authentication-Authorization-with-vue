<script setup lang="ts">
import { authChannel, useIdle, userAuth } from '@/auth'
import { onMounted, watch } from 'vue'

const { setIdle } = useIdle()

onMounted(() => {
  authChannel.subscribe(event => {
    if (event === 'logout') {
      location.reload()
    }
  })
})

watch(
  () => userAuth.isAuth,
  () => setIdle(),
)
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
