<template>
  <Icon icon="clipboard" tag="a" class="clipboard" @click="copy" :title="$t('action.copy')" />
</template>

<script>
  export default {
    name: 'clipboard',
    props: {
      string: {type: String, required: true}
    },
    methods: {
      copy() {
        let textarea = document.createElement('textarea')
        textarea.textContent = this.string
        textarea.style.position = 'fixed'
        document.body.appendChild(textarea)
        textarea.select()
        try {
          document.execCommand('copy')
        } finally {
          document.body.removeChild(textarea)
        }
      }
    }
  }
</script>

<style scoped>
  .clipboard:hover {
    transform: scale(1.2);
  }
</style>
