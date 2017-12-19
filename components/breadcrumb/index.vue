<template>
  <div class="breadcrumb">
    <ul>
      <li>
        <nuxt-link to="/">
          <span class="fa fa-home"></span>
          QtumScan
        </nuxt-link>
      </li>
      <li v-for="({name}, index) in breadcrumbs" :class="{'is-active': index === breadcrumbs.length - 1}">
        <nuxt-link :to="{name, params: $route.params}">
          <component :is='name' v-bind="$route.params"></component>
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
  import AddressId from './address-id'
  import BlockId from './block-id'
  import TxId from './tx-id'

  export default {
    computed: {
      breadcrumbs() {
        let path = []
        for (let route of this.$route.matched) {
          path.push({name: route.name})
        }
        return path
      }
    },
    components: {
      'address-id': AddressId,
      'block-id': BlockId,
      'tx-id': TxId
    }
  }
</script>

<style scoped>
  .breadcrumb {
    margin-left: 1em;
  }
  span.fa {
    margin-right: 0.3em;
  }
</style>
