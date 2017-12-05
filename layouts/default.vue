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
          <form class="navbar-end" @submit.prevent="search">
            <div class="navbar-item input-item">
              <input type="text" class="input" v-model="searchString"
                placeholder="Search by Block / Address / Transaction">
              <button type="submit" class="button is-primary" :disabled="searching">
                <span v-if="searching" class="fa fa-spinner fa-pulse"></span>
                <span v-else class="fa fa-search"></span>
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
  import Breadcrumb from '@/components/breadcrumb/index.vue'
  import Block from '@/models/block'
  import Transaction from '@/models/transaction'

  export default {
    data() {
      return {
        searchString: '',
        searching: false
      }
    },
    methods: {
      async search() {
        let searchString = this.searchString
        if (!searchString || this.searching) {
          return
        }
        this.searching = true
        if (/^0|[1-9]\d*$/.test(searchString)) {
          let height = Number(searchString)
          try {
            await Block.getHash(height)
            this.searchString = ''
            this.searching = false
            this.$router.push(`/block/${height}`)
            return
          } catch (err) {}
        }
        try {
          await Block.get(searchString)
          this.searchString = ''
          this.searching = false
          this.$router.push(`/block/${searchString}`)
          return
        } catch (err) {}
        try {
          await Transaction.get(searchString)
          this.searchString = ''
          this.searching = false
          this.$router.push(`/tx/${searchString}`)
          return
        } catch (err) {}
        this.searching = false
      }
    },
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
