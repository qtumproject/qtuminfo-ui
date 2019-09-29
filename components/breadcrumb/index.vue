<template>
  <div class="breadcrumb">
    <ul class="breadcrumb-list">
      <li class="home">
        <nuxt-link to="/">首页</nuxt-link>
      </li>
      <li>
        /
      </li>
      <li v-for="{name, component} in breadcrumbs" class="page">
        <nuxt-link :to="{name, params: $route.params}">
          <component :is="component" v-bind="$route.params"></component>
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { i18n } from "@/plugins/i18n";
import AddressId from "./address-id";
import Block from "./block";
import BlockId from "./block-id";
import ContractId from "./contract-id";
import ContractTokens from "./contract-tokens";
import deal from './deal'
import TxId from "./tx-id";
import Misc from "./misc";

export default {
  computed: {
    breadcrumbs() {
      let path = [];
      for (let route of this.$route.matched) {
        let name = route.path
          .slice(1)
          .replace("/", "-")
          .replace(":", "")
          .replace("?", "");
        if (name in this.$options.components) {
          path.push({ name: route.name, component: name });
        }
      }
      return path;
    }
  },
  components: {
    "address-id": AddressId,
    "block-": Block,
    "block-id": BlockId,
    "contract-id": ContractId,
    "contract-tokens": ContractTokens,
    "tx-id": TxId,
    'misc': Misc,
    'deal':deal
  }
};
</script>

<style lang="less" scoped>
// .breadcrumb {
//   margin-left: 1em;
//   display: flex;
// }
// .breadcrumb-list {
//   display: flex;
//   align-items: center;
//   padding:.size(23px)[] 0 .size(17px)[] 0;
//   li{
//     padding-right:.size(7px)[];
//     font-size: .size(16px) [];
//     a {
//       color: @qtum-blue;
//     }
//   }
// }
// span:not(:only-child) {
//   &.fab,
//   &.fas {
//     margin-right: 0.3em;
//   }
// }
// @media (max-width: 768px) {
//   span {
//     max-width: 15em;
//     overflow: hidden;
//     text-overflow: ellipsis;
//   }
// }
</style>
