<template>
  <div class="breadcrumb">
    <ul>
      <li>
        <nuxt-link to="/">
          <span class="fa fa-home"></span>
          qtum.info
        </nuxt-link>
      </li>
      <li v-for="({name}, index) in breadcrumbs">
        <nuxt-link :to="{name, params: $route.params}">
          <component :is='name' v-bind="$route.params"></component>
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
  import {i18n} from '@/plugins/i18n'
  import AddressId from './address-id'
  import BlockId from './block-id'
  import ContractId from './contract-id'
  import TxId from './tx-id'
  import Misc from './misc'
  import RichList from './misc/rich-list'

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
      'contract-id': ContractId,
      'tx-id': TxId,
      'misc': Misc,
      'misc-rich-list': RichList
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
