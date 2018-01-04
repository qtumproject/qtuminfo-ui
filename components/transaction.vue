<template>
  <div class="columns is-multiline transaction-item">
    <div class="column is-full is-clearfix">
      <div class="pull-left collapse-bottom">
        <Icon
          :icon="collapsed ? 'chevron-right' : 'chevron-down'" fixed-width
          class="toggle-collapse"
          @click="collapsed = !collapsed"
        ></Icon>
        <TransactionLink :transaction="id"></TransactionLink>
      </div>
      <div class="pull-right">
        <span v-if="confirmations"
          class="tag" :class="confirmations >= 6 ? 'is-success' : 'is-warning'">
          {{ confirmations }} {{ $tc('transaction.confirmations', confirmations) }}
        </span>
        <span v-else class="tag is-danger">{{ $t('transaction.unconfirmed') }}</span>
        <span class="timestamp">{{ transaction.time | timestamp }}</span>
      </div>
    </div>
    <div class="column is-clearfix collapse">
      <template v-if="inputs[0].address">
        <div v-for="input in (collapsed ? mergeInputs(inputs) : inputs)" class="is-clearfix">
          <AddressLink :address="input.address" class="pull-left"></AddressLink>
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
          <AddressLink v-if="output.address" :address="output.address" class="pull-left"></AddressLink>
          <span v-else class="pull-left">Unparsed Address</span>
          <span class="pull-right amount" v-if="output.value">
            {{ output.value | qtum(8) }} QTUM
          </span>
          <span class="pull-right" v-else-if="contractInfo">
            Contract {{ contractInfo.type[0].toUpperCase() + contractInfo.type.slice(1) }}
          </span>
        </div>
      </template>
      <template v-else>
        <div v-for="output in outputs" class="is-clearfix">
          <AddressLink v-if="output.address" :address="output.address" class="pull-left"></AddressLink>
          <span v-else class="pull-left">Unparsed Address</span>
          <span class="pull-right amount" v-if="output.value">
            {{ output.value | qtum(8) }} QTUM
          </span>
          <span class="pull-right" v-else-if="contractInfo">
            Contract {{ contractInfo.type[0].toUpperCase() + contractInfo.type.slice(1) }}
          </span>
          <div class="is-clearfix"></div>
          <div class="output-script">
            <div>
              <span class="key">Type</span>
              <span class="value">{{ output.scriptPubKey.type }}</span>
            </div>
            <div v-if="output.scriptPubKey.asm">
              <span class="key">Script</span>
              <code class="value">{{ output.scriptPubKey.asm | qtum-script }}</code>
            </div>
          </div>
        </div>
      </template>
    </div>
    <template v-if="tokenTransfers">
      <template v-for="({from, to, amount}, index) in tokenTransferList">
        <div class="column is-full flex-full"></div>
        <AttributeInjector
          class="column collapse token-transfer-list"
          :class="{
            'first-item': index === 0,
            'last-item': index === tokenTransferList.length - 1
          }">
          <div class="is-clearfix">
            <template v-if="from">
              <div class="is-clearfix">
                <AddressLink :address="from" class="pull-left"></AddressLink>
                <span class="pull-right amount">
                  {{ amount | token(token.decimals) }} {{ token.symbol }}
                </span>
              </div>
            </template>
            <template v-else>Newly Generated Tokens</template>
          </div>
          <Icon icon="arrow-right" class="arrow"></Icon>
          <div class="is-half">
            <div class="is-clearfix">
              <AddressLink :address="to" class="pull-left"></AddressLink>
              <span class="pull-right amount">
                {{ amount | token(token.decimals) }} {{ token.symbol }}
              </span>
            </div>
          </div>
        </AttributeInjector>
      </template>
    </template>
    <code class="column is-full break-word" v-if="contractInfo && !collapsed">{{ contractInfo.code }}</code>
    <div class="column is-full has-text-right collapse-bottom" v-if="fees">
      <template v-if="fees > 0">
        Fee <span class="amount fee">{{ fees | qtum }} QTUM</span>
      </template>
      <template v-else>
        Reward <span class="amount fee">{{ -fees | qtum }} QTUM</span>
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
      transaction: {type: Object, required: true}
    },
    computed: {
      id() {
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
      },
      tokenTransfers() {
        return this.transaction.tokenTransfers
      },
      token() {
        return this.tokenTransfers && this.tokenTransfers.token
      },
      tokenTransferList() {
        return this.tokenTransfers && this.tokenTransfers.list
      },
      contractInfo() {
        for (let output of this.outputs) {
          let chunks = output.scriptPubKey.asm.split(' ')
          switch (chunks[chunks.length - 1]) {
          case 'OP_CREATE':
            return {
              type: 'create',
              version: chunks[0],
              gasLimit: chunks[1],
              gasPrice: chunks[2],
              code: chunks[3]
            }
          case 'OP_CALL':
            return {
              type: 'call',
              version: chunks[0],
              gasLimit: chunks[1],
              gasPrice: chunks[2],
              code: chunks[3],
              address: chunks[4]
            }
          }
        }
        return null
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
          if ('address' in cloned) {
            let item = result.find(x => x.address === output.address)
            if (item) {
              item.value += output.value
              continue
            }
          }
          result.push(cloned)
        }
        return result.sort((x, y) => {
          if (!x.address) {
            return -1
          } else if (!y.address) {
            return 1
          } else if (x.address[0] === 'Q' && y.address[0] !== 'Q') {
            return -1
          } else if (x.address[0] !== 'Q' && y.address[0] === 'Q') {
            return 1
          } else if (x.address < y.address) {
            return -1
          } else if (x.address > y.address) {
            return 1
          } else {
            return 0
          }
        })
      }
    },
    filters: {
      'qtum-script'(asm) {
        let chunks = asm.split(' ')
        if (['OP_CREATE', 'OP_CALL'].includes(chunks[chunks.length - 1])) {
          chunks[3] = '[byte code]'
          return chunks.join(' ')
        } else {
          return asm
        }
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

  .flex-full {
    padding: 0;
  }

  .toggle-collapse {
    cursor: pointer;
    transition: transform 0.2s;
    &:hover {
      transform: scale(1.2);
    }
  }

  .tag, .timestamp {
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

  .token-transfer-list {
    &:not(.first-item) {
      padding-top: 0;
    }
    &:not(.last-item) {
      padding-bottom: 0;
    }
  }
</style>
