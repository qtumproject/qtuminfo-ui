<template>
  <nav class="navbar">
    <div class="navbar-brand is-size-4">
      <nuxt-link to="/" class="navbar-item">QtumScan</nuxt-link>
      <button type="button" class="button navbar-burger" @click="showMenu = !showMenu">
        <span></span><span></span><span></span>
      </button>
    </div>
    <div class="navbar-menu" :class="{'is-active': showMenu}">
      <div class="navbar-start is-uppercase">
        <nuxt-link to="/" class="navbar-item" @click.native="showMenu = !showMenu">
          {{ $t('blockchain.blockchain') }}
        </nuxt-link>
        <nuxt-link to="/" class="navbar-item" @click.native="showMenu = !showMenu">
          {{ $tc('blockchain.token') }}
        </nuxt-link>
      </div>
      <form class="navbar-end" @submit.prevent="search">
        <div class="navbar-item input-item">
          <input type="text" class="input" v-model="searchString"
            placeholder="Search by Block / Address / Transaction">
          <button type="submit" class="button is-primary" :disabled="searching">
            <Icon v-if="searching" icon="spinner pulse"></Icon>
            <Icon v-else icon="search"></Icon>
          </button>
        </div>
      </form>
    </div>
  </nav>
</template>

<script>
  import {get as qtumscanGet} from '@/services/qtumscan-api'

  export default {
    data() {
      return {
        showMenu: false,
        searchString: '',
        searching: false
      }
    },
    methods: {
      async search() {
        let searchString = this.searchString.trim()
        if (!searchString || this.searching) {
          return
        }
        this.searching = true
        try {
          let {type} = await qtumscanGet(`/search/${searchString}`)
          switch (type) {
          case 'address':
            this.searchString = ''
            this.$router.push(`/address/${searchString}`)
            break
          case 'block-height':
          case 'block-hash':
            this.searchString = ''
            this.$router.push(`/block/${searchString}`)
            break
          case 'transaction':
            this.searchString = ''
            this.$router.push(`/tx/${searchString}`)
            break
          }
        } catch (err) {}
        this.showMenu = false
        this.searching = false
      }
    }
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
