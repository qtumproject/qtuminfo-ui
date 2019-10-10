<template>
  <div class="pagination">
    <div class="pagination-wrapper">
      <button class="prev">前一页</button>
      <input class="current" v-model="inputValue"/>
      <button class="next">后一页</button>
      <span class="total">共100页</span>
    </div>
  </div>
</template>

<script>
import { Responsive } from "@/plugins/mixins";

export default {
  mixins: [Responsive],
  data() {
    return {
      inputValue: "1"
    };
  },
  props: {
    // pages: { type: Number, required: true },
    // currentPage: { type: Number, required: true },
    // getLink: { type: Function, required: true }
  },
  methods: {
    submit() {
      let input = this.inputValue.trim();
      if (/^[1-9]\d*$/.test(input)) {
        let page = Number.parseInt(input);
        if (page <= this.pages && page !== this.currentPage) {
          this.$router.push(this.getLink(page));
        }
      }
    }
  },
  watch: {
    currentPage() {
      this.inputValue = "";
      this.$refs.input.blur();
    }
  }
};
</script>

<style lang="less" scoped>
@import url('../styles/components/pagination.less');
// .pagination-form {
//   margin-left: 2em;
//   .label {
//     display: inline-block;
//     margin-bottom: 0;
//     margin-right: 0.5em;
//     @media (min-width: 769px) {
//       line-height: 2;
//     }
//   }
//   .control {
//     display: inline-block;
//     width: 3.5em;
//     vertical-align: middle;
//     @media (max-width: 768px) {
//       width: 3em;
//     }
//   }
// }
</style>
