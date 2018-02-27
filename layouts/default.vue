<template>
  <div id="app">
    <header class="container">
      <Navigator></Navigator>
    </header>
    <div class="background">
      <div class="container">
        <Breadcrumb v-if="$route.path !== '/'"></Breadcrumb>
      </div>
      <nuxt></nuxt>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
  import Navigator from '@/components/nav.vue'
  import Breadcrumb from '@/components/breadcrumb/index.vue'
  import Footer from '@/components/footer.vue'

  export default {
    head() {
      return {
        htmlAttrs: {
          lang: this.$store.state.locale.language
        }
      }
    },
    components: {Navigator, Breadcrumb, Footer}
  }
</script>

<style scoped>
  .background {
    background-color: #f5f6f8;
    padding: 0.5rem 0 1rem;
  }
</style>
