<script setup lang="ts">
import { accessToken, api, isAuth, permissions, role, userInfo } from '@/auth'

const getSomeData = async () => {
  try {
    const { data } = await api.get('/data')
    await api.get('/new-data')
  } catch (error) {}
}
</script>

<template>
  <pre>
    {{ accessToken }}
    {{ userInfo }}
    {{ permissions }}
    {{ role }}
    {{ isAuth }}
  </pre>

  <button @click="getSomeData">Get the data</button>
  <button>logout</button>
</template>
