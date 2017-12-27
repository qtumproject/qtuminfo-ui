<template>
  <span>
    <nuxt-link :to="(address[0] === 'Q' ? '/address/' : '/contract/') + address"
      class="break-word" :class="{'has-text-weight-semibold': highlight}">
      {{ address }}
    </nuxt-link>
    <Clipboard v-if="copyable" :string="address"></Clipboard>
  </span>
</template>

<script>
  import Clipboard from './clipboard.vue'

  export default {
    name: 'address-link',
    props: {
      address: {type: String, required: true},
      copyable: {type: Boolean, default: false},
      highlight: {type: Boolean, default: false}
    },
    components: {Clipboard}
  }
</script>

<style src="@/styles/common.css"></style>
