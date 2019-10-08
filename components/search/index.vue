<template>
  <div class="search">
    <form @submit.prevent="search">
      <input
        type="text"
        v-model="searchString"
        class="input"
        placeholder="Search by address/txhash/block/token"
      />
      <!-- <input type="submit" class="search-btn" value /> -->
    </form>
  </div>
</template>
<script>
import { get as qtuminfoGet } from "@/services/qtuminfo-api";

export default {
  data() {
    return {
      searchString: ""
    };
  },
  methods: {
    async search() {
      let searchString = this.searchString.trim();
      if (!searchString) {
        return;
      }
      try {
        let { type, id, addressHex } = await qtuminfoGet(`/search`, {
          params: { query: searchString }
        });
        switch (type) {
          case "address":
            this.searchString = "";
            this.$router.push(`/address/${searchString}`);
            break;
          case "block":
            this.searchString = "";
            this.$router.push(`/block/${searchString}`);
            break;
          case "contract":
            this.searchString = "";
            if (addressHex) {
              this.$router.push(`/contract/${addressHex}`);
            } else {
              this.$router.push(`/contract/${searchString}`);
            }
            break;
          case "transaction":
            this.searchString = "";
            this.$router.push(`/tx/${searchString}`);
            break;
        }
      } catch (err) {}
    }
  }
};
</script>
<style lang="less" scoped>
@import url("../../styles/components/search.less");
</style>
