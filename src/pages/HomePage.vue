<script setup lang="ts">
import { api, CanView, checkPermissions, logout, userAuth } from '@/auth'

const getSomeData = async () => {
  try {
    await api.get('/data')
    await api.get('/new-data')
  } catch (error) {}
}

const paragraphSection = checkPermissions(userAuth.permissions, { permission: 'edit_testing' })
const headingSection = checkPermissions(userAuth.permissions, {
  allOf: ['edit_profile', 'manage_users'],
})
</script>

<template>
  <pre>
    {{ userAuth.accessToken }}
    {{ userAuth.userInfo }}
    {{ userAuth.permissions }}
    {{ userAuth.role }}
    {{ userAuth.isAuth }}
  </pre>

  <CanView :status="headingSection">
    <h2>Can view this heading</h2>
    <template #title> No 😀 </template>
  </CanView>
  <CanView :status="paragraphSection">
    <p>
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tenetur fuga soluta ullam commodi
      quas, laboriosam nisi exercitationem veritatis nostrum velit laudantium possimus mollitia ut
      est quia alias? Culpa aut facere sint dignissimos dicta, facilis quas deleniti modi quae
      officia illo cumque expedita, tenetur laborum adipisci, rerum cum illum minima perferendis.
      Ut, debitis. Molestiae sunt quidem ducimus omnis sequi? Molestiae vero et culpa nostrum quo,
      rem odit temporibus laudantium ipsa optio. Quisquam ut odit enim deserunt, totam laborum
      sapiente consectetur temporibus perferendis assumenda accusantium? Laboriosam praesentium
      mollitia iste culpa laborum. Consectetur magnam enim quod dolore laudantium aut ipsam quam
      quis modi.
    </p>
  </CanView>

  <button @click="getSomeData">Get the data</button>
  <button @click="logout">logout</button>
</template>
