<template>
  <div class="columns is-multiline transaction-item">
    <div class="column is-full is-clearfix">
      <div class="pull-left collapse-bottom">
        <Icon
          :icon="collapsed ? 'chevron-right' : 'chevron-down'" fixed-width
          class="toggle-collapse"
          @click="collapsed = !collapsed"
        ></Icon>
        <TransactionLink :transaction="hash"></TransactionLink>
      </div>
      <div class="pull-right collapse-bottom" v-if="fees">
        <template v-if="fees > 0">
          Fee <span class="amount fee">{{ fees | qtum }} QTUM</span>
        </template>
        <template v-else>
          Reward <span class="amount fee">{{ -fees | qtum }} QTUM</span>
        </template>
      </div>
      <span v-if="confirmations"
        class="tag pull-left" :class="confirmations >= 6 ? 'is-success' : 'is-warning'">
        {{ confirmations }} {{ $tc('transaction.confirmations', confirmations) }}
      </span>
      <span v-else class="tag is-danger pull-left">{{ $t('transaction.unconfirmed') }}</span>
    </div>
    <div class="column is-clearfix collapse">
      <template v-if="inputs[0].address">
        <div v-for="input in (collapsed ? mergeInputs(inputs) : inputs)" class="is-clearfix">
          <AddressLink :address="input.address"
            :highlight="highlight === input.address"
            class="pull-left"
          ></AddressLink>
          <span class="pull-right amount">
            {{ input.value | qtum(8) }} QTUM
          </span>
        </div>
      </template>
      <template v-else>Newly Generated Coins</template>
    </div>
    <Icon icon="arrow-right" class="column arrow collapse"></Icon>
    <div class="column is-half collapse">
      <template v-if="collapsed">
        <div v-for="output in mergeOutputs(outputs)" class="is-clearfix">
          <AddressLink v-if="output.scriptPubKey.addresses"
            :address="outputAddress(output)"
            :highlight="highlight === outputAddress(output)"
            class="pull-left"
          ></AddressLink>
          <span v-else class="pull-left">Unparsed Address</span>
          <span class="pull-right amount" v-if="output.value">
            {{ output.value | qtum(8) }} QTUM
          </span>
        </div>
      </template>
      <template v-else>
        <div v-for="output in outputs" class="is-clearfix">
          <AddressLink v-if="output.scriptPubKey.addresses"
            :address="outputAddress(output)"
            :highlight="highlight === outputAddress(output)"
            class="pull-left"
          ></AddressLink>
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

  export default {
    data() {
      return {
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
      confirmations() {
        return this.transaction.confirmations
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
              && this.outputAddress(x) === this.outputAddress(output)
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
          } else if (this.outputAddress(x) < this.outputAddress(y)) {
            return -1
          } else if (this.outputAddress(x) > this.outputAddress(y)) {
            return 1
          } else {
            return 0
          }
        })
        return result.sort(this.addressSorting)
      },
      outputAddress(output) {
        return output.scriptPubKey.addresses[0]
      }
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
