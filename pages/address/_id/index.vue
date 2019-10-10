<template>
  <div>
    <table>
      <thead>
        <tr>
          <td>交易id</td>
          <td>时间</td>
          <td>净收入</td>
          <td>手续费</td>
          <td>交易类型</td>
          <td>确认数</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="transaction in transactions">
          <td>
            <nuxt-link :to="{name: 'address-id', params: {id: id}}">{{id | format(15,6)}}</nuxt-link>
          </td>
          <td>
            <FromNow :timestamp="transaction.timestamp" />
          </td>
          <td>{{transaction.outputValue - transaction.inputValue}} QTUM</td>
          <td>{{transaction.fees |qtum(3)}} QTUM</td>
          <td>QTUM转账</td>
          <td>{{transaction.confirmations}}个确认</td>
        </tr>
      </tbody>
    </table>
    <pagination />
  </div>
</template>
<script>
import Vue from "vue";
import Pagination from "@/components/pagination";
import Address from "@/models/address";
import Transaction from "@/models/transaction";
import { RequestError } from "@/services/qtuminfo-api";
import { extendAddress } from "@/utils/address";
import { scrollIntoView } from "@/utils/dom";
export default {
  components: { Pagination },
  data() {
    return {
      totalCount: 0,
      transactions: [],
      currentPage: Number(this.$route.query.page || 1)
    };
  },
  async asyncData({ req, params, query, redirect, error }) {
    try {
      if (query.page && !/^[1-9]\d*$/.test(query.page)) {
        redirect(`/address/${params.id}/`);
      }
      let page = Number(query.page || 1);
      let { totalCount, transactions } = await Address.getTransactions(
        params.id,
        { page: page - 1, pageSize: 20 },
        { ip: req && req.ip }
      );
      if (page > 1 && totalCount <= (page - 1) * 20) {
        redirect(`/address/${params.id}/`, {
          page: Math.ceil(totalCount / 20)
        });
      }
      transactions = await Transaction.getBrief(transactions, {
        ip: req && req.ip
      });
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
    addresses() {
      let result = [];
      for (let address of this.id.split(",")) {
        if (!result.includes(address)) {
          result.push(address);
        }
      }
      return result;
    },
    pages() {
      return Math.ceil(this.totalCount / 20);
    }
  },
  methods: {
    getLink(page) {
      return { name: "address-id", params: { id: this.id }, query: { page } };
    },
    async onTransaction({ address, id }) {
      if (
        this.addresses.includes(address) &&
        this.transactions.every(item => item.id !== id)
      ) {
        this.transactions.unshift(await Transaction.getBrief(id));
      }
    },
    transactionChange(oldTransaction, newTransaction) {
      Vue.set(oldTransaction, "blockHeight", newTransaction.blockHeight);
      Vue.set(oldTransaction, "blockHash", newTransaction.blockHash);
      Vue.set(oldTransaction, "timestamp", newTransaction.timestamp);
      oldTransaction.outputs = newTransaction.outputs;
      oldTransaction.refundValue = newTransaction.refundValue;
      oldTransaction.fees = newTransaction.fees;
      oldTransaction.contractSpends = newTransaction.contractSpends;
      oldTransaction.qrc20TokenTransfers = newTransaction.qrc20TokenTransfers;
      oldTransaction.qrc721TokenTransfers = newTransaction.qrc721TokenTransfers;
    },
    subscribeAddress(address) {
      this.$subscribe(
        "address/" + address,
        "address/transaction",
        this._onTransaction
      );
    },
    unsubscribeAddress(address) {
      this.$unsubscribe(
        "address/" + address,
        "address/transaction",
        this._onTransaction
      );
    }
  },
  mounted() {
    this._onTransaction = this.onTransaction.bind(this);
    for (let address of this.addresses) {
      this.subscribeAddress(address);
    }
    this.$subscribedAddresses = this.addresses;
    console.log("transactions:", this.transactions);
  },
  beforeDestroy() {
    for (let address of this.$subscribedAddresses) {
      this.unsubscribeAddress(address);
    }
  },
  async beforeRouteUpdate(to, from, next) {
    for (let address of this.addresses) {
      this.unsubscribeAddress(address);
    }
    let page = Number(to.query.page || 1);
    let { totalCount, transactions } = await Address.getTransactions(this.id, {
      page: page - 1,
      pageSize: 20
    });
    this.totalCount = totalCount;
    if (page > this.pages && this.pages > 1) {
      this.$router.push({
        name: "address-id",
        params: { id: this.id },
        query: { page: Math.ceil(totalCount / 20) }
      });
      return;
    }
    this.transactions = await Transaction.getBrief(transactions);
    this.currentPage = page;
    next();
    for (let address of this.addresses) {
      this.subscribeAddress(address);
    }
    this.$subscribedAddresses = this.addresses;
    scrollIntoView(this.$refs["transaction-list"]);
  },
  scrollToTop: true
};
</script>
<style lang="less" scoped>
@import url("../../../styles/pages/address/_id/index.less");
</style>