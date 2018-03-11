<template>
  <div id="app">
    <header class="container">
      <Navigator />
    </header>
    <div class="background">
      <div class="container">
        <Breadcrumb v-if="$route.path !== '/'" />
      </div>
      <nuxt />
    </div>
    <Footer />
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
  #app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  .background {
    flex: 1;
    padding: 0.5rem 0 1rem;
    background-color: #f5f6f8;
  }
</style>
