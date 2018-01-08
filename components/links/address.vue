<template>
  <span>
    <AttributeInjector class="break-word">
      <span v-if="highlight">
        <slot>
          {{ address }}
        </slot>
      </span>
      <nuxt-link v-else :to="(address.length === 34 ? '/address/' : '/contract/') + address">
        <slot>
          {{ address }}
        </slot>
      </nuxt-link>
    </AttributeInjector>
    <Clipboard v-if="copyable" :string="address"></Clipboard>
  </span>
</template>

<script>
  import Clipboard from './clipboard.vue'

  export default {
    name: 'address-link',
    props: {
      address: {type: String, required: true},
      highlight: Boolean,
      copyable: {type: Boolean, default: false},
    },
    components: {Clipboard}
  }
</script>

<style src="@/styles/common.css"></style>
