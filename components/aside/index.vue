<template>
  <ul>
    <li v-for="item in this.list" :key="item.info">
      <NuxtLink :to="{ path: '/misc/toolbox/'+item.url }">{{item.info}}</NuxtLink>
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
  mounted() {
    console.log(this.list);
  }
};
</script>
<style lang="less" scoped>
@import url("../../styles/components/aside.less");
</style>