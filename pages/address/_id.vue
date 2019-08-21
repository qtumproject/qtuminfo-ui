<template>
  <div class="container">
    <Panel width="100%" height="255px" title="交易概览" noMargin="true">
      <div class="address-info">
        <div class="address-info-left list">
          <ul>
            <li>
              <div class="item-title">qtum余额</div>
              <div class="item-info">{{ balance | qtum }} QTUM</div>
            </li>
            <li>
              <div class="item-title">挖矿锁定金额</div>
              <div class="item-info">{{ staking | qtum }} QTUM</div>
            </li>
            <li>
              <div class="item-title">Token 余额</div>
              <div class="item-info"></div>
            </li>
            <li>
              <div class="item-title">可选</div>
              <div class="item-info"></div>
            </li>
          </ul>
        </div>
        <div class="address-info-right list">
          <ul>
            <li>
              <div class="item-title">排名</div>
              <div class="item-info">{{ ranking }}</div>
            </li>
            <li>
              <div class="item-title">交易数</div>
              <div class="item-info">{{ transactionCount }}</div>
            </li>
            <li>
              <div class="item-title">收入合计</div>
              <div class="item-info">{{ totalReceived | qtum }} QTUM</div>
            </li>
            <li>
              <div class="item-title">支出合计</div>
              <div class="item-info">{{ totalSent | qtum }} QTUM</div>
            </li>
          </ul>
        </div>
      </div>
    </Panel>
    <Panel width="100%" :address="address" class="address-detail">
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
      transactionCount: 0,
      address: [
        {
          link: "address-id",
          name: "交易明细",
          id: this.$route.params.id
        },
        {
          link: "address-id-balance",
          name: "余额变动",
          id: this.$route.params.id
        }
      ]
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
    existingTokenBalances() {
      return this.qrc20Balances.filter(token => token.balance !== "0");
    },
    myAddresses() {
      return this.$store.state.address.myAddresses;
    }
  },
  methods: {
    addMyAddress(address) {
      this.$store.commit("address/my-addresses/add", address);
    },
    removeMyAddress(address) {
      this.$store.commit("address/my-addresses/remove", address);
    }
  }
};
</script>
<style lang="less" scoped>
@import "./_id.less";
</style>