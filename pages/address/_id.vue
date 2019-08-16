<template>
  <div class="container">
    <Panel width="100%" height="255px" title="交易概览" noMargin="true">
      <div class="address-info">
        <div class="address-info-left list">
          <ul>
            <li>
              <div class="item-title">qtum余额</div>
              <div class="item-info">{{addressHeight}}</div>
            </li>
            <li>
              <div class="item-title">挖矿锁定金额</div>
              <div class="item-info">{{confirmation}}</div>
            </li>
            <li>
              <div class="item-title">Token 余额</div>
              <div class="item-info">{{timestamp | timestamp}}</div>
            </li>
            <li>
              <div class="item-title">可选</div>
              <div class="item-info">{{size}}</div>
            </li>
          </ul>
        </div>
        <div class="address-info-right list">
          <ul>
            <li>
              <div class="item-title">排名</div>
              <div class="item-info">{{inputsValue | qtum(7)}} QTUM</div>
            </li>
            <li>
              <div class="item-title">交易数</div>
              <div class="item-info">{{outputsValue | qtum(7)}} QTUM</div>
            </li>
            <li>
              <div class="item-title">收入合计</div>
              <div class="item-info">{{fees | qtum(7)}} QTUM</div>
            </li>
            <li>
              <div class="item-title">支出合计</div>
              <div class="item-info">{{outputsValue | qtum(7)}} QTUM</div>
            </li>
          </ul>
        </div>
      </div>
    </Panel>
    <Panel width="100%" height="952.5px" title="交易明细\余额变动" class="address-detail">
        <nuxt-child></nuxt-child>
    </Panel>
  </div>
</template>
<script>
import Panel from "../../components/panel";
import Address from "@/models/address";
import Transaction from "@/models/transaction";
export default {
  components: { Panel },
  head() {
    return {
      title: this.$t("blockchain.address") + " " + this.id
    };
  },
  middleware: "check-address",
  data() {
    return {
      balance: "0",
      totalReceived: "0",
      totalSent: "0",
      unconfirmed: "0",
      staking: "0",
      qrc20Balances: [],
      ranking: 0,
      blocksMined: 0,
      transactionCount: 0
    };
  },
  async asyncData({ req, params, query, redirect, error }) {
    try {
      let address = await Address.get(params.id, { ip: req && req.ip });
      return address;
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
<style lang="less" scoped>
@import "./_id.less";
</style>