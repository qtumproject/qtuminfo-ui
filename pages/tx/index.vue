<template>
  <div class="container">
    <Panel width="100%" title="交易列表">
      <table>
        <thead>
          <tr>
            <td>交易id</td>
            <td>时间</td>
            <td>交易金额</td>
            <td>手续费</td>
            <td>交易类型</td>
            <td>确认数</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="{id, timestamp,outputValue, fees, confirmations} of list">
            <td>
              <nuxt-link :to="{name: 'tx-id', params: {id: id}}">{{id | format(15,6)}}</nuxt-link>
            </td>
            <td>
              <FromNow :timestamp="timestamp" />
            </td>
            <td>{{outputValue | qtum(4)}}</td>
            <td>{{fees | qtum(4)}}</td>
            <td>QTUM类型</td>
            <td>{{confirmations}}</td>
          </tr>
        </tbody>
      </table>
    </Panel>
  </div>
</template>
<script>
import Panel from "../../components/panel";
import Transaction from "@/models/transaction";
import { RequestError } from "@/services/qtuminfo-api";
export default {
  components: { Panel },
  head() {
    return {
      title: this.$t("block.list.block_list")
    };
  },
  data() {
    return {
      list: [],
      date: ""
    };
  },
  async asyncData({ req, query, redirect, error }) {
    try {
      let list = await Transaction.getRecentTransactions({
        params: {
          count: 20,
          confirmations: 1
        },
        ip: req && req.ip
      });
      return { list };
    } catch (err) {
      if (err instanceof RequestError) {
        error({ statusCode: err.code, message: err.message });
      } else {
        error({ statusCode: 500, message: err.message });
      }
    }
  }
};
</script>
<style lang='less' scoped>
@import "./index.less";
</style>
