<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')

const submit = () => {
  if (name.value && email.value && password.value) {
    router.push('/home')
  }
}
</script>

<template>
  <main class="page">
    <h1>Sign up</h1>
    <form @submit.prevent="submit">
      <label for="name">Name</label>
      <input v-model="name" id="name" type="text" />

      <label for="email">Email</label>
      <input v-model="email" id="email" type="email" />

      <label for="password">Password</label>
      <input v-model="password" id="password" type="password" />

      <button type="submit">Create account</button>
    </form>
    <p>
      Already have an account?
      <RouterLink to="/login">Log in</RouterLink>
    </p>
  </main>
</template>
