<template>
  <div>
    <table>
      <thead>
        <tr>
          <td>交易id</td>
          <td>时间</td>
          <td>账户余额</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="{id, blockHeight, timestamp, balance, amount} in transactions">
          <td>
            <nuxt-link :to="{name: 'address-id', params: {id: id}}">{{id | format(8,13)}}</nuxt-link>
          </td>
          <td>{{ timestamp | timestamp }}</td>
          <td>{{ balance | qtum(8) }} QTUM</td>
        </tr>
      </tbody>
    </table>
    <pagination />
  </div>
</template>
<script>
import Vue from "vue";
import Pagination from "@/components/pagination";
import { Responsive } from "@/plugins/mixins";
import Address from "@/models/address";
import { RequestError } from "@/services/qtuminfo-api";
import { scrollIntoView } from "@/utils/dom";

export default {
  components: { Pagination },
  mixins: [Responsive],
  data() {
    return {
      totalCount: 0,
      transactions: [],
      currentPage: Number(this.$route.query.page || 1)
    };
  },
  props: {
    tokens: { type: Array, required: true }
  },
  async asyncData({ req, params, query, redirect, error }) {
    try {
      if (query.page && !/^[1-9]\d*$/.test(query.page)) {
        redirect(`/address/${params.id}/balance`);
      }
      let page = Number(query.page || 1);
      let { totalCount, transactions } = await Address.getBalanceTransactions(
        params.id,
        { page: page - 1, pageSize: 100 },
        { ip: req && req.ip }
      );
      if (page > 1 && totalCount <= (page - 1) * 100) {
        redirect(`/address/${params.id}/balance`, {
          page: Math.ceil(totalCount / 100)
        });
      }
      return { totalCount, transactions };
    } catch (err) {
      if (err instanceof RequestError) {
        error({ statusCode: err.code, message: err.message });
      } else {
        error({ statusCode: 500, message: err.message });
      }
    }
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    pages() {
      return Math.ceil(this.totalCount / 100);
    }
  },
  methods: {
    getLink(page) {
      return {
        name: "address-id-balance",
        params: { id: this.id },
        query: { page }
      };
    }
  },
  async beforeRouteUpdate(to, from, next) {
    let page = Number(to.query.page || 1);
    let { totalCount, transactions } = await Address.getBalanceTransactions(
      this.id,
      { page: page - 1, pageSize: 100 }
    );
    this.totalCount = totalCount;
    if (page > this.pages && this.pages > 1) {
      this.$router.push({
        name: "address-id-balance",
        params: { id: this.id },
        query: { page: Math.ceil(totalCount / 100) }
      });
      return;
    }
    this.transactions = transactions;
    this.currentPage = page;
    next();
    scrollIntoView(this.$refs.list);
  },
  scrollToTop: true
};
</script>
<style lang="less" scoped>
@import url("../../../styles/pages/address/_id/balance.less");
</style>