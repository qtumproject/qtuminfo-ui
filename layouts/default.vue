<template>
  <div id="app">
    <div>
      <header class="container">
        <Navigator />
      </header>
    </div>
    <div class="background">
      <div class="container">
        <Breadcrumb v-if="$route.path !== '/'" />
      </div>
      <nuxt />
    </div>
    <MyAddresses class="my-addresses" />
    <Footer />
  </div>
</template>

<script>
  import Navigator from '@/components/nav.vue'
  import Breadcrumb from '@/components/breadcrumb/index.vue'
  import Footer from '@/components/footer.vue'
  import MyAddresses from '@/components/my-addresses.vue'

  export default {
    head() {
      return {
        htmlAttrs: {
          lang: this.$store.state.locale.language
        }
      }
    },
    mounted() {
      if (navigator.serviceWorker) {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
          registration.update()
          setInterval(() => registration.update(), 3600 * 1000)
        })
      }
      if (window.Notification) {
        Notification.requestPermission()
      }
    },
    components: {Navigator, Breadcrumb, Footer, MyAddresses}
  }
</script>

<style lang="less" scoped>
  #app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  .background {
    position: relative;
    flex: 1;
    padding: 0.5rem 0 1rem;
    background-color: #f5f6f8;
  }
  .my-addresses {
    position: fixed;
    z-index: 100;
    @media (max-width: 768px) {
      bottom: 1em;
      right: 1em;
    }
    @media (min-width: 769px) {
      bottom: 2em;
      right: 2em;
    }
  }
</style>
