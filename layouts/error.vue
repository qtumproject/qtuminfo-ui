<template>
  <div id="app">
    <header class="container">
      <Navigator />
    </header>
    <div class="error-container">
      <div class="has-text-centered">
        <p class="is-size-3">{{ error.message }}</p>
        <br>
        <nuxt-link to="/" class="button is-qtum is-size-5">Back to Home Page</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
  import Navigator from '@/components/nav.vue'

  export default {
    props: ['error'],
    head() {
      return {
        htmlAttrs: {
          lang: this.$store.state.locale.language
        }
      }
    },
    components: {Navigator}
  }
</script>

<style scoped>
  #app {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  .error-container {
    flex: auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
