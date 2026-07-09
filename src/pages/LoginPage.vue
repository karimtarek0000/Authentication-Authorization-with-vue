<script setup lang="ts">
import { login } from '@/auth'
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

const { replace } = useRouter()
const { query } = useRoute()
const email = ref('')
const password = ref('')

const submit = async () => {
  try {
    await login({ email: email.value, password: password.value })

    if (query?.page) {
      replace(query?.page as string)
    }
  } catch (error) {}
}
</script>

<template>
  <main class="page">
    <h1>Login</h1>
    <form @submit.prevent="submit">
      <label for="email">Email</label>
      <input v-model="email" id="email" type="email" />

      <label for="password">Password</label>
      <input v-model="password" id="password" type="password" />

      <button type="submit">Log in</button>
    </form>
    <p>
      Need an account?
      <RouterLink to="/signup">Create one</RouterLink>
    </p>
  </main>
</template>
