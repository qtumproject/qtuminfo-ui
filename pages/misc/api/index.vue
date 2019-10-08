<template>
  <div class="flex">
    <Aside :list="itemlist"></Aside>
    <section>
      <nuxt-child></nuxt-child>
    </section>
  </div>
</template>
<script>
import Aside from "@/components/aside";
export default {
  components: {
    Aside
  },
  data() {
    return {
      itemlist: [
        {
          info: "简介",
          url: "/index"
        },
        {
          info: "账户",
          url: "/index"
        },
        {
          info: "合约",
          url: "/index"
        },
        {
          info: "事务",
          url: "/index"
        },
        {
          info: "事件日志",
          url: "/index"
        },
        {
          info: "令牌",
          url: "/index"
        }
      ]
    };
  }
};
</script>
<style lang="less" scoped>
@import url("../../../styles/pages/misc/api/index.less");
</style>