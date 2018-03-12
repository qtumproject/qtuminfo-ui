<template>
  <div class="breadcrumb">
    <ul>
      <li>
        <nuxt-link to="/">
          <span class="fa fa-home"></span>
        </nuxt-link>
      </li>
      <li v-for="{name, component} in breadcrumbs">
        <nuxt-link :to="{name, params: $route.params}">
          <component :is='component' v-bind="$route.params"></component>
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
  import {i18n} from '@/plugins/i18n'
  import AddressId from './address-id'
  import Block from './block'
  import BlockId from './block-id'
  import ContractId from './contract-id'
  import ContractTokens from './contract-tokens'
  import TxId from './tx-id'
  import Misc from './misc'

  export default {
    computed: {
      breadcrumbs() {
        let path = []
        for (let route of this.$route.matched) {
          let name = route.path.slice(1).replace('/', '-').replace(':', '').replace('?', '')
          if (name in this.$options.components) {
            path.push({name: route.name, component: name})
          }
        }
        return path
      }
    },
    components: {
      'address-id': AddressId,
      'block-': Block,
      'block-id': BlockId,
      'contract-id': ContractId,
      'contract-tokens': ContractTokens,
      'tx-id': TxId,
      'misc': Misc
    }
  }
</script>

<style scoped>
  .breadcrumb {
    margin-left: 1em;
  }
  span.fa:not(:only-child) {
    margin-right: 0.3em;
  }
</style>
