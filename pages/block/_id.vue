<template>
  <div class="container">
    <Panel width="100%" height="255px" title="区块详情" noMargin="true">
      <div class="block-info">
        <div class="block-info-left list">
          <ul>
            <li>
              <div class="item-title">区块高度</div>
              <div class="item-info">3423333</div>
            </li>
            <li class="border">
              <div class="item-title">区块哈希</div>
              <div class="item-info">3423333</div>
            </li>
            <li class="border">
              <div class="item-title">区块大小</div>
              <div class="item-info">3423333</div>
            </li>
            <li class="border">
              <div class="item-title">确认数</div>
              <div class="item-info">3423333</div>
            </li>
            <li>
              <div class="item-title">区块大小</div>
              <div class="item-info">3423333</div>
            </li>
          </ul>
        </div>
        <div class="block-info-right list">
          <ul>
            <li>
              <div class="item-title">区块高度</div>
              <div class="item-info">3423333</div>
            </li>
            <li>
              <div class="item-title">区块哈希</div>
              <div class="item-info">3423333</div>
            </li>
            <li>
              <div class="item-title">区块大小</div>
              <div class="item-info">3423333</div>
            </li>
            <li>
              <div class="item-title">确认数</div>
              <div class="item-info">3423333</div>
            </li>
            <li>
              <div class="item-title">区块大小</div>
              <div class="item-info">3423333</div>
            </li>
          </ul>
        </div>
      </div>
    </Panel>

    <div class="deal-detail">
      <Panel width="100%" height="952.5px" title="交易明细">
        <table>
          <thead>
            <tr>
              <td>交易id</td>
              <td>时间</td>
              <td>手续费</td>
              <td>交易类型</td>
              <td>确认数</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="transaction in transactions">
              <td>{{transaction.id | format(15,6)}}</td>
              <td><FromNow :timestamp="transaction.timestamp" /></td>
              <td>{{transaction.fees | qtum(3)}}QTUM</td>
              <td>QTUM类型</td>
              <td>{{transaction.confirmations}}</td>
            </tr>
          </tbody>
        </table>
      </Panel>
    </div>
  </div>
</template>

<script>
import Panel from "../../components/panel";
import Block from "@/models/block";
import Transaction from "@/models/transaction";
import RequestError from "@/services/qtuminfo-api";
export default {
  components: { Panel },
  head() {
    return {
      title: ''
    };
  },
  data() {
    return {
      height: 0,
      hash: 0,
      time: 0,
      size: 0,
      reward: 0,
      difficulty: 0,
      merkleRoot: "",
      miner: null,
      prevHash: null,
      nextHash: null,
      tx: [],
      transactions: [],
      currentPage: Number(this.$route.query.page || 1)
    };
  },
    async asyncData({ req, params, query, redirect, error }) {
      let id = params.id;
      try {
        let block = await Block.get(id, { ip: req && req.ip });

        let transactions = await Transaction.getBrief(
          block.transactions.slice(0, 20),
          { ip: req && req.ip }
        );
        return {
          height: block.height,
          hash: block.hash,
          timestamp: block.timestamp,
          size: block.size,
          weight: block.weight,
          reward: block.reward,
          difficulty: block.difficulty,
          merkleRoot: block.merkleRoot,
          miner: block.miner || null,
          prevHash: block.prevHash || null,
          nextHash: block.nextHash || null,
          tx: block.transactions,
          transactions
        };
      } catch (err) {
        if (err instanceof RequestError) {
          if (err.code === 404) {
            error({ statusCode: 404, message: `Block ${id} not found` });
          } else {
            error({ statusCode: err.code, message: err.message });
          }
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