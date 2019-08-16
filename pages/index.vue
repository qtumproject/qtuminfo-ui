<template>
  <div class="container">
    <div class="notification">
      <i></i>
      <span>2019 QTUM 黑客松大赛全球征集令开始报名啦</span>
    </div>

    <Panel title="全网概览" width="100%" height="355px" icon="icon-global" noMargin="true">
      <div class="detail">
        <div class="info">
          <span class="title">全网状态</span>
          <div class="frame">
            <div class="icon" v-for="(item,index) in icons">
              <div class="icons">
                <i :class="`icon-${item.img}`"></i>
              </div>
              <p :class="index === 0||index===4 ? 'word' :'word border'">{{item.describe}}</p>
              <p class="number">{{item.number}}</p>
            </div>
          </div>
        </div>
        <div class="info">
          <span class="title">QTUM过去14天交易数</span>
          <div class="frame"></div>
        </div>
      </div>
    </Panel>

    <div class="block-deal">
      <Panel title="区块" width="590px" height="720px" icon="icon-block" link="/block">
        <table class="block-table">
          <thead>
            <tr>
              <td class="td-block">区块</td>
              <td class="td-address">地址</td>
              <td class="td-deal">交易数</td>
              <td class="td-award">奖励</td>
              <td class="td-time">时间</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="block in recentBlocks">
              <td>
                <nuxt-link :to="{name: 'block-id', params: {id: block.height}}">{{block.height}}</nuxt-link>
              </td>
              <td>
                <nuxt-link
                  :to="{name: 'address-id', params: {id: block.miner}}"
                >{{block.miner | format(8,9)}}</nuxt-link>
              </td>
              <td>{{block.transactionCount}}</td>
              <td>{{block.reward | qtum(4) }}QTUM</td>
              <td>
                <FromNow :timestamp="block.timestamp" />
              </td>
            </tr>
          </tbody>
        </table>
      </Panel>
      <Panel title="交易" width="590px" height="720px" icon="icon-deal" link="/deal">
        <table class="deal-table">
          <thead>
            <tr>
              <td class="td-hash">哈希</td>
              <td class="td-trade">交易额</td>
              <td class="td-time">时间</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="transaction in recentTransactions" :key="transaction.id">
              <td>
                <nuxt-link
                  :to="{name: 'tx-id', params: {id: transaction.id}}"
                >{{transaction.id | format(10,15)}}</nuxt-link>
              </td>
              <td>{{ transaction.outputValue | qtum(4) }} QTUM</td>
              <td>一分钟前</td>
            </tr>
          </tbody>
        </table>
      </Panel>
    </div>
  </div>
</template>
<script>
import Panel from "../components/panel";
import Block from "@/models/block";
import Transaction from "@/models/transaction";
import Misc from "@/models/misc";
import { RequestError } from "@/services/qtuminfo-api";

export default {
  components: { Panel },
  head() {
    return {
      title: "qtum.info",
      titleTemplate: null
    };
  },
  data() {
    return {
      icons: [
        {
          img: "global",
          describe: "全球节点数",
          number: "6554"
        },
        {
          img: "global",
          describe: "全球节点数",
          number: "6554"
        },
        {
          img: "global",
          describe: "全球节点数",
          number: "6554"
        },
        {
          img: "global",
          describe: "全球节点数",
          number: "6554"
        },
        {
          img: "global",
          describe: "全球节点数",
          number: "6554"
        },
        {
          img: "global",
          describe: "全球节点数",
          number: "6554"
        },
        {
          img: "global",
          describe: "全球节点数",
          number: "6554"
        },
        {
          img: "global",
          describe: "全球节点数",
          number: "6554"
        }
      ],
      recentBlocks: [],
      recentTransactions: [],
      netStakeWeight: 0,
      feeRate: 0
    };
  },
  async asyncData({ req, error }) {
    try {
      let [
        recentBlocks,
        recentTransactions,
        { netStakeWeight, feeRate }
      ] = await Promise.all([
        Block.getRecentBlocks({ ip: req && req.ip }),
        Transaction.getRecentTransactions({ ip: req && req.ip }),
        Misc.info({ ip: req && req.ip })
      ]);
      return { recentBlocks, recentTransactions, netStakeWeight, feeRate };
    } catch (err) {
      if (err instanceof RequestError) {
        error({ statusCode: err.code, message: err.message });
      } else {
        error({ statusCode: 500, message: err.message });
      }
    }
  },
  computed: {
    blockchain() {
      return this.$store.state.blockchain;
    }
  },
  methods: {
    onMempoolTransaction(transaction) {
      this.recentTransactions.unshift(transaction);

      if (this.recentTransactions.length > 13) {
        this.recentTransactions.pop();
      }
    },
    onStakeWeight(stakeWeight) {
      this.netStakeWeight = stakeWeight;
    },
    onFeeRate(feeRate) {
      this.feeRate = feeRate;
    }
  },

  watch: {
    async "blockchain.height"(height) {
      console.log(height);
      if (height === this.recentBlocks[0].height + 1) {
        let block = await Block.get(height);
        this.recentBlocks.unshift({
          hash: block.hash,
          height: block.height,
          timestamp: block.timestamp,
          interval: block.interval,
          size: block.size,
          transactionCount: block.transactions.length,
          miner: block.miner,
          reward: block.reward
        });
        this.recentBlocks.pop();
      } else {
        this.recentBlocks = await Block.getRecentBlocks();
      }
    }
  },

  mounted() {
    this._onMempoolTransaction = this.onMempoolTransaction.bind(this);
    this._onStakeWeight = this.onStakeWeight.bind(this);
    this._onFeeRate = this.onFeeRate.bind(this);

    this.$subscribe(
      "mempool",
      "mempool/transaction",
      this._onMempoolTransaction
    );
    this.$subscribe("blockchain", "stakeweight", this._onStakeWeight);
    this.$subscribe("blockchain", "feerate", this._onFeeRate);
  },
  beforeDestroy() {
    this.$unsubscribe(
      "mempool",
      "mempool/transaction",
      this._onMempoolTransaction
    );
    this.$unsubscribe("blockchain", "stakeweight", this._onStakeWeight);
    this.$unsubscribe("blockchain", "feerate", this._onFeeRate);
  }
};
</script>
<style lang="less" scoped>
@import "../styles/main.less";
.notification {
  display: flex;
  align-items: center;
  padding: .size(30px) [] 0 .size(13px) [] 0;
  i {
    width: .size(30px) [];
    height: .size(30px) [];
    display: block;
    background: url("~assets/sprites.png") 0px -35px no-repeat;
    background-size: 40 * 0.75px auto;
  }
  span {
    color: @title-blue;
    font-size: .size(16px) [];
    width: .size(276px) [];
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.detail {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 297.75px;
  .info {
    width: 50%;
    padding: .size(30px) [] .size(40px) [] .size(20px) [] .size(40px) [];
    span {
      font-size: .size(16px) [];
      color: @font-gray;
    }
    .frame {
      border: 1px solid @border-gray;
      height: .size(315px) [];
      margin-top: .size(20px) [];
      border-radius: 6px;
      display: flex;
      flex-wrap: wrap;
      .icon {
        width: .size(175px) [];
        height: .size(157px) [];
        .word {
          font-size: .size(14px) [];
          color: @frame-gray;
          text-align: center;
        }
        .border {
          border-left: 1px solid @frame-gray;
          border-style: dashed;
        }
        .number {
          padding-top: .size(10px) [];
          font-size: .size(18px) [];
          text-align: center;
        }
        .icons {
          width: 100%;
          margin-top: .size(40px) [];
          .icon-global {
            height: .size(45px) [];
            width: .size(30px) [];
            display: block;
            background: url("~assets/sprites.png") 0px -90px no-repeat;
            background-size: 40 * 0.75px auto;
            margin: 0 auto;
          }
        }
      }
    }
  }
  .qtum-deal-chart {
    width: 50%;
    padding: .size(30px) [] .size(40px) [] .size(20px) [] .size(40px) [];
  }
}
.block-deal {
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-top: .size(30px) [];
  .block-table {
    thead {
      tr {
        td {
          font-size: .size(14px) [];
          color: @font-gray;
        }
        td:nth-child(1) {
          padding: .size(30px) [] 0 .size(20px) [] .size(30px) [];
        }
        .td-block {
          width: .size(125px) [];
        }
        .td-address {
          width: .size(260px) [];
        }
        .td-deal {
          width: .size(105px) [];
        }
        .td-award {
          width: .size(175px) [];
        }
        .td-time {
          width: .size(85px) [];
        }
        .td-trade {
          width: .size(270px) [];
        }
        .td-hash {
          width: .size(390px) [];
        }
      }
    }
    tbody {
      tr {
        border-bottom: 1px solid @border-gray;
        a {
          color: @title-blue;
        }
        td {
          font-size: .size(16px) [];
        }
        td:nth-child(1) {
          padding: .size(30px) [] 0 .size(17px) [] .size(30px) [];
          color: @title-blue;
          font-size: .size(18px) [];
        }
        td:nth-child(2) {
          color: @title-blue;
        }
      }
    }
  }
  .deal-table {
    thead {
      tr {
        td {
          font-size: .size(14px) [];
          color: @font-gray;
        }
        td:nth-child(1) {
          padding: .size(30px) [] 0 .size(20px) [] .size(30px) [];
        }
        .td-time {
          width: .size(85px) [];
        }
        .td-trade {
          width: .size(270px) [];
        }
        .td-hash {
          width: .size(390px) [];
        }
      }
    }
    tbody {
      tr {
        border-bottom: 1px solid @border-gray;
        td {
          font-size: .size(16px) [];
        }
        td:nth-child(1) {
          padding: .size(30px) [] 0 .size(17px) [] .size(30px) [];
          a {
            color: @title-blue;
          }
        }
      }
    }
  }
}
</style>


