<template>
  <span>
    <nuxt-link :to="(address.length === 34 ? '/address/' : '/contract/') + address" class="break-word">
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
      copyable: {type: Boolean, default: false}
    },
    components: {Clipboard}
  }
</script>

<style src="@/styles/common.css"></style>
