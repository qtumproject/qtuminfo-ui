<template>
  <div class="container">
    <Panel :title="this.title" width="100%" noMargin="true">
      <div class="address-info">
        <div class="address-info-left list">
          <ul>
            <li>
              <div class="item-title">Token名称</div>
              <div class="item-info">{{ qrc20.name }}</div>
            </li>
            <li class="border">
              <div class="item-title">发行量</div>
              <div class="item-info">
                {{ qrc20.totalSupply | qrc20(qrc20.decimals, true) }}
                {{ qrc20.symbol || $t('contract.token.tokens') }}
              </div>
            </li>
            <li class="border">
              <div class="item-title">合约地址</div>
              <div class="item-info">{{addressHex}}</div>
            </li>
            <li>
              <div class="item-title">创建人</div>
              <div class="item-info"></div>
            </li>
          </ul>
        </div>
        <div class="address-info-right list">
          <ul>
            <li>
              <div class="item-title">排名</div>
              <div class="item-info"></div>
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
    <Panel width="100%" :address="panelAddress" class="address-detail">
      <nuxt-child :qrc20="qrc20"></nuxt-child>
    </Panel>
  </div>
</template>
<script>
import Panel from "../../components/panel";
import Contract from "@/models/contract";
import { RequestError } from "@/services/qtuminfo-api";
export default {
  components: { Panel },
  head() {
    return {
      title: this.$t("blockchain.contract") + " " + this.id
    };
  },
  data() {
    return {
      address: "",
      addressHex: "",
      vm: "",
      type: "",
      qrc20: null,
      qrc721: null,
      balance: "0",
      totalReceived: "0",
      totalSent: "0",
      qrc20Balances: [],
      transactionCount: 0,
      panelAddress: [
        {
          link: "contract-id",
          name: "交易明细",
          id: this.$route.params.id
        },
        {
          link: "contract-id-rich-list",
          name: "富豪榜",
          id: this.$route.params.id
        }
      ]
    };
  },
  async asyncData({ req, params, query, redirect, error }) {
    try {
      let contract = await Contract.get(params.id);
      return {
        address: contract.address,
        addressHex: contract.addressHex,
        vm: contract.vm,
        type: contract.type,
        qrc20: contract.qrc20,
        qrc721: contract.qrc721,
        balance: contract.balance,
        totalReceived: contract.totalReceived,
        totalSent: contract.totalSent,
        qrc20Balances: contract.qrc20Balances,
        transactionCount: contract.transactionCount
      };
    } catch (err) {
      if (err instanceof RequestError) {
        if (err.code === 404) {
          error({ statusCode: 404, message: `Contract ${param.id} not found` });
        } else {
          error({ statusCode: err.code, message: err.message });
        }
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
      return Math.ceil(this.transactionCount / 20);
    },
    existingTokenBalances() {
      return this.qrc20Balances.filter(token => token.balance !== "0");
    },
    title() {
      return this.qrc20.name + "概览";
    }
  }
};
</script>
<style lang="less" scoped>
@import url('../../styles/pages/contract/_id.less');
</style>