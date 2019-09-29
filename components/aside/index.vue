<template>
  <ul>
    <li v-for="item in this.list">
        <nuxt-link :to="item.url">
            {{item.info}}
        </nuxt-link>
    </li>
  </ul>
</template>
<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  mounted(){
    console.log(this.list)
  }
};
</script>
<style lang="less" scoped>
@import url('../../styles/components/aside.less');
</style>