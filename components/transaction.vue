<template>
  <div class="columns is-multiline transaction-item">
    <div class="column is-full is-clearfix">
      <div class="pull-left collapse-bottom">
        <span :class="[
          'fa', 'fa-fw',
          collapsed ? 'fa-chevron-right' : 'fa-chevron-down',
          'toggle-collapse'
        ]" @click="collapsed = !collapsed"></span>
        Transaction
        <nuxt-link :to="'/tx/' + hash" class="break-words">{{ hash }}</nuxt-link>
      </div>
      <div class="pull-right collapse-bottom" v-if="fees">
        <template v-if="fees > 0">
          Fee <span class="amount fee">{{ fees | qtum }} QTUM</span>
        </template>
        <template v-else>
          Reward <span class="amount fee">{{ -fees | qtum }} QTUM</span>
        </template>
      </div>
      <span v-if="blockchainInfo.height"
        :class="['tag', blockchainInfo.height - height + 1 >= 6 ? 'is-info' : 'is-warning', 'pull-left']">
        {{ blockchainInfo.height - height + 1 }} confirmation(s)
      </span>
    </div>
    <div class="column is-clearfix collapse">
      <template v-if="inputs[0].address">
        <div v-for="input in (collapsed ? mergeInputs(inputs) : inputs)" class="is-clearfix">
          <span v-if="input.address === highlight" class="pull-left break-words">
            {{ input.address }}
          </span>
          <nuxt-link v-else :to="'/address/' + input.address" class="pull-left break-words">
            {{ input.address }}
          </nuxt-link>
          <span class="pull-right amount">
            {{ input.value | qtum(8) }} QTUM
          </span>
        </div>
      </template>
      <template v-else>Newly Generated Coins</template>
    </div>
    <span class="column fa fa-arrow-right arrow collapse"></span>
    <div class="column is-half collapse">
      <template v-if="collapsed">
        <div v-for="output in mergeOutputs(outputs)" class="is-clearfix">
          <template v-if="output.scriptPubKey.addresses">
            <span v-if="output.scriptPubKey.addresses[0] === highlight" class="pull-left break-words">
              {{ output.scriptPubKey.addresses[0] }}
            </span>
            <nuxt-link v-else :to="'/address/' + output.scriptPubKey.addresses[0]" class="pull-left break-words">
              {{ output.scriptPubKey.addresses[0] }}
            </nuxt-link>
          </template>
          <span v-else class="pull-left">Unparsed Address</span>
          <span class="pull-right amount" v-if="output.value">
            {{ output.value | qtum(8) }} QTUM
          </span>
        </div>
      </template>
      <template v-else>
        <div v-for="output in outputs" class="is-clearfix">
          <template v-if="output.scriptPubKey.addresses">
            <span v-if="output.scriptPubKey.addresses[0] === highlight" class="pull-left break-words">
              {{ output.scriptPubKey.addresses[0] }}
            </span>
            <nuxt-link v-else :to="'/address/' + output.scriptPubKey.addresses[0]" class="pull-left break-words">
              {{ output.scriptPubKey.addresses[0] }}
            </nuxt-link>
          </template>
          <span v-else class="pull-left">Unparsed Address</span>
          <span class="pull-right amount" v-if="output.value">
            {{ output.value | qtum(8) }} QTUM
          </span>
          <div class="is-clearfix"></div>
          <div class="output-script">
            <div>
              <span class="key">Type</span>
              <span class="value">{{ output.scriptPubKey.type }}</span>
            </div>
            <div>
              <span class="key">Script</span>
              <code class="value">{{ output.scriptPubKey.asm }}</code>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  import Transaction from '@/models/transaction'
  import {get as qtumscanGet} from '@/services/qtumscan-api'

  export default {
    data() {
      return {
        blockchainInfo: {},
        collapsed: true
      }
    },
    props: {
      transaction: {type: Object, required: true},
      highlight: String
    },
    computed: {
      hash() {
        return this.transaction.txid
      },
      inputs() {
        return this.transaction.vin
      },
      outputs() {
        return this.transaction.vout
      },
      fees() {
        return this.transaction.fees
      },
      height() {
        return this.transaction.blockHeight
      }
    },
    methods: {
      mergeInputs(inputs) {
        let result = []
        for (let input of inputs) {
          let item = result.find(x => x.address === input.address)
          if (item) {
            item.value += input.value
          } else {
            result.push({
              address: input.address,
              value: input.value
            })
          }
        }
        return result.sort((x, y) => {
          if (x.address < y.address) {
            return -1
          } else if (x.address > y.address) {
            return 1
          } else {
            return 0
          }
        })
      },
      mergeOutputs(outputs) {
        let result = []
        for (let output of outputs) {
          let cloned = JSON.parse(JSON.stringify(output))
          if ('addresses' in cloned.scriptPubKey) {
            let item = result.find(x => (
              x.scriptPubKey.addresses
              && x.scriptPubKey.addresses[0] === output.scriptPubKey.addresses[0]
            ))
            if (item) {
              item.value += output.value
              continue
            }
          }
          result.push(cloned)
        }
        return result.sort((x, y) => {
          if (!('addresses' in x.scriptPubKey)) {
            return -1
          } else if (!('addresses' in y.scriptPubKey)) {
            return 1
          } else if (x.scriptPubKey.addresses[0] < y.scriptPubKey.addresses[0]) {
            return -1
          } else if (x.scriptPubKey.addresses[0] > y.scriptPubKey.addresses[0]) {
            return 1
          } else {
            return 0
          }
        })
        return result.sort(this.addressSorting)
      }
    },
    async mounted() {
      this.blockchainInfo = await qtumscanGet('/info')
    }
  }
</script>

<style lang="less" scoped>
  .transaction-item {
    padding-left: 0.75em;
    padding-right: 0.75em;
    &::before {
      display: block;
      width: 100%;
      height: 1px;
      background-color: #ccc;
      content: "";
    }
    &:first-child {
      margin-top: 0;
      &::before {
        display: none;
      }
    }
    &:last-child {
      margin-bottom: 0;
    }
  }

  .toggle-collapse {
    cursor: pointer;
    transition: transform 0.2s;
    &:hover {
      transform: scale(1.2);
    }
  }

  .break-words {
    word-break: break-all;
  }

  .tag {
    margin-left: 1em;
  }

  .output-script {
    font-size: 0.8em;
    .key {
      display: inline-block;
      margin-left: 2em;
      margin-right: 1em;
      font-weight: bold;
    }
    code {
      word-break: break-all;
    }
  }

  .arrow {
    flex: 0;
    line-height: 1.5em;
  }
  .amount {
    font-family: Monospace;
  }
  .fee {
    margin-left: 0.5em;
  }
</style>
