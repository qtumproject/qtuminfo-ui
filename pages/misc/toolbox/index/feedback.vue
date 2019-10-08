<template>
  <Panel width="100%" height="450px">
    <form @submit.prevent="submit" class="form">
      <textarea class="feedback" autofocus placeholder="RAW transaction data" v-model="text"></textarea>
      <div class="submit">
        <button>Send</button>
      </div>
    </form>
  </Panel>
</template>
<script>
import Panel from "@/components/panel";
export default {
  components: {
    Panel
  },
  data() {
    return {
      text: ""
    };
  },
  methods: {
    submit() {
      window.alert("发送成功");
    }
  }
};
</script>
<style lang="less" scoped>
@import url("../../../../styles/pages/misc/toolbar/feedback.less");
</style>