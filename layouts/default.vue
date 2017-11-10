<template>
  <div id="app">
    <header class="container">
      <nav class="navbar">
        <div class="navbar-brand is-size-4">
          <nuxt-link to="/" class="navbar-item">QtumScan</nuxt-link>
        </div>
        <div class="navbar-menu">
          <div class="navbar-start is-uppercase">
            <nuxt-link to="/" class="navbar-item">
              {{ $t('blockchain.blockchain') }}
            </nuxt-link>
            <nuxt-link to="/" class="navbar-item">
              {{ $tc('blockchain.token') }}
            </nuxt-link>
          </div>
          <form class="navbar-end" @submit.prevent>
            <div class="navbar-item input-item">
              <input
                type="text" class="input"
                placeholder="Search by Block / Address / Transaction">
              <button type="submit" class="button is-primary">
                <span class="fa fa-search"></span>
              </button>
            </div>
          </form>
        </div>
      </nav>
      <Breadcrumb v-if="$route.path !== '/'"></Breadcrumb>
    </header>
    <nuxt></nuxt>
  </div>
</template>

<script>
  import Breadcrumb from "@/components/breadcrumb/index.vue"

  export default {
    components: {Breadcrumb}
  }
</script>

<style lang="less" scoped>
  .navbar-end {
    flex: auto;
    align-items: center;
    .navbar-item {
      flex: auto;
      position: relative;
      input {
        padding-right: 3em;
      }
      button {
        position: absolute;
        top: 0.5em;
        right: 1em;
      }
    }
  }
</style>
