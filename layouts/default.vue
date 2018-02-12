<template>
  <div id="app">
    <header class="container">
      <Navigator></Navigator>
    </header>
    <div class="hero">
      <div class="hero-body">
        <div class="container">
          <Breadcrumb v-if="$route.path !== '/'"></Breadcrumb>
        </div>
        <nuxt></nuxt>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
  import Navigator from '@/components/nav.vue'
  import Breadcrumb from '@/components/breadcrumb/index.vue'
  import Footer from '@/components/footer.vue'

  export default {
    components: {Navigator, Breadcrumb, Footer}
  }
</script>

<style scoped>
  .hero {
    background-color: #f5f6f8;
  }
  .hero-body {
    padding: 1rem 0;
  }
</style>
