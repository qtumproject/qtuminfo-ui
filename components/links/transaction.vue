<template>
  <span>
    <nuxt-link :to="'/tx/' + transaction" class="break-word monospace">
      {{ transaction }}
    </nuxt-link>
    <Clipboard :string="transaction"></Clipboard>
  </span>
</template>

<script>
  import Clipboard from './clipboard.vue'

  export default {
    name: 'transaction-link',
    props: {
      transaction: {type: String, required: true}
    },
    components: {Clipboard}
  }
</script>

<style src="@/styles/common.css"></style>
