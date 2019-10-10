<template>
  <div class="container">
    <Panel width="100%" height="255px" title="交易概览" noMargin="true">
      <div class="block-info">
        <div class="block-info-left list">
          <ul>
            <li v-if="blockHeight">
              <div class="item-title">所属区块</div>
              <div class="item-info">{{blockHeight}}</div>
            </li>
            <li>
              <div class="item-title">确认数</div>
              <div class="item-info">{{confirmation}}</div>
            </li>
            <li>
              <div class="item-title">时间</div>
              <div class="item-info">{{timestamp | timestamp}}</div>
            </li>
            <li>
              <div class="item-title">大小</div>
              <div class="item-info">{{size}}</div>
            </li>
          </ul>
        </div>
        <div class="block-info-right list">
          <ul>
            <li>
              <div class="item-title">输入</div>
              <div class="item-info">{{inputsValue | qtum(7)}} QTUM</div>
            </li>
            <li>
              <div class="item-title">输出</div>
              <div class="item-info">{{outputsValue | qtum(7)}} QTUM</div>
            </li>
            <li>
              <div class="item-title">矿工费</div>
              <div class="item-info">{{fees | qtum(7)}} QTUM</div>
            </li>
          </ul>
        </div>
      </div>
    </Panel>

    <div class="deal-detail">
      <Panel width="100%" title="交易明细">
        <div class="deal-detail-info">
          <div class="deal-detail-list">
            <div class="list-send">
              <div>输入 ({{inputs.length}}) {{inputsValue|qtum(7)}} QTUM</div>
              <ul>
                <li v-for="input in inputs">
                  <span><nuxt-link :to="{name: 'address-id', params: {id: input.address}}">{{input.address}}</nuxt-link></span>
                  <span>{{input.value | qtum(3)}}QTUM</span>
                </li>
              </ul>
            </div>
            <div class="list-icon"></div>
            <div class="list-receive">
              <div>输出 ({{outputs.length}}) {{outputsValue|qtum(7)}} BTC</div>
              <ul>
                <li v-for="output in outputs">
                  <span><nuxt-link :to="{name: 'address-id', params: {id: output.address}}">{{output.address}}</nuxt-link> </span>
                  <span>{{output.value | qtum(3)}}QTUM</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="script">
            <div class="script-input">
              <div class="script-caption">输入脚本</div>
              <ul>
                <li v-for="input in inputs">{{input.scriptSig.asm}}</li>
              </ul>
            </div>
            <div class="script-output">
              <div class="script-caption">输出脚本</div>
              <ul>
                <li v-for="output in outputs">{{output.scriptPubKey.asm}}</li>
              </ul>
            </div>
          </div>
        </div>
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
      title: ""
    };
  },
  data() {
    return {
      id: "",
      hash: "",
      isCoinbase: false,
      confirmation: "",
      fees: "0",
      inputs: [],
      inputsValue: "0",
      outputs: [],
      outputsValue: "0",
      refundValue: "0",
      blockHeight: null,
      blockHash: null,
      timestamp: null,
      size: 0,
      contractSpends: [],
      qrc20TokenTransfers: [],
      qrc721TokenTransfers: []
    };
  },
  async asyncData({ req, params, error }) {
    try {
      let transaction = await Transaction.get(params.id, { ip: req && req.ip });
      console.log(transaction);
      return {
        id: transaction.id,
        hash: transaction.hash,
        isCoinbase: transaction.isCoinbase,
        confirmation: transaction.confirmations,
        fees: transaction.fees,
        inputs: transaction.inputs,
        inputsValue: transaction.inputValue,
        outputs: transaction.outputs,
        outputsValue: transaction.outputValue,
        refundValue: transaction.refundValue,
        blockHeight: transaction.blockHeight,
        blockHash: transaction.blockHash,
        timestamp: transaction.timestamp,
        size: transaction.size,
        contractSpends: transaction.contractSpends,
        qrc20TokenTransfers: transaction.qrc20TokenTransfers,
        qrc721TokenTransfers: transaction.qrc721TokenTransfers
      };
    } catch (err) {
      if (err instanceof RequestError) {
        if (err.code === 404) {
          error({
            statusCode: 404,
            message: `Transaction ${param.id} not found`
          });
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
@import url("../../styles/pages/tx/_id.less");
</style>