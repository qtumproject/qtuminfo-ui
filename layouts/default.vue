<template>
  <div id="app">
    <header class="container">
      <Navigator></Navigator>
      <Breadcrumb v-if="$route.path !== '/'"></Breadcrumb>
    </header>
    <nuxt></nuxt>
  </div>
</template>

<script>
  import Navigator from '@/components/nav.vue'
  import Breadcrumb from '@/components/breadcrumb/index.vue'

  export default {
    components: {Navigator, Breadcrumb}
  }
</script>
