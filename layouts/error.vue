<template>
  <div class="error-container">
    <p class="is-size-3">{{ error.message }}</p>
    <br>
    <nuxt-link to="/" class="button is-qtum is-size-5">Back to Home Page</nuxt-link>
  </div>
</template>

<script>
  import Navigator from '@/components/nav.vue'

  export default {
    props: ['error'],
    head() {
      return {
        title: 'Error',
        htmlAttrs: {
          lang: this.$store.state.locale.language
        }
      }
    },
    components: {Navigator}
  }
</script>

<style scoped>
  .error-container {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>
