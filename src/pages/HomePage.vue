<script setup lang="ts">
import { api, logout, userAuth } from '@/auth'

const getSomeData = async () => {
  try {
    await api.get('/data')
    await api.get('/new-data')
  } catch (error) {}
}
</script>

<template>
  <pre>
    {{ userAuth.accessToken }}
    {{ userAuth.userInfo }}
    {{ userAuth.permissions }}
    {{ userAuth.role }}
    {{ userAuth.isAuth }}
  </pre>

  <button @click="getSomeData">Get the data</button>
  <button @click="logout">logout</button>
</template>
