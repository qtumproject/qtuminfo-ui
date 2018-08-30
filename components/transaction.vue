<template>
  <div class="columns is-multiline transaction-item">
    <div class="column is-full is-clearfix">
      <div class="is-pulled-left collapse-bottom">
        <Icon v-if="detailed"
          :icon="collapsed ? 'chevron-right' : 'chevron-down'" fixedWidth
          class="toggle-collapse"
          @click="collapsed = !collapsed" />
        <TransactionLink :transaction="id" />
      </div>
      <div class="is-pulled-right">
        <nuxt-link v-if="confirmations" :to="{name: 'block-id', params: {id: transaction.blockHeight}}"
          class="tag" :class="confirmations >= 10 ? 'is-success' : 'confirmation-' + confirmations">
          {{ confirmations }} {{ $tc('transaction.confirmations', confirmations) }}
        </nuxt-link>
        <span v-else class="tag is-danger">{{ $t('transaction.unconfirmed') }}</span>
        <span v-if="transaction.timestamp" class="timestamp">
          {{ transaction.timestamp | timestamp }}
        </span>
      </div>
    </div>
    <div class="column is-clearfix collapse">
      <template v-if="inputs[0].coinbase">{{ $t('transaction.coinbase_input') }}</template>
      <template v-else>
        <div v-for="input in inputs" class="is-clearfix">
          <AddressLink v-if="input.address" :address="input.address" class="is-pulled-left"
            :highlight="highlightAddress" />
          <span v-else class="is-pulled-left">{{ $t('transaction.unparsed_address' )}}</span>
          <span class="is-pulled-right amount">
            <TransactionLink :transaction="input.prevTxId" :clipboard="false">
              <Icon icon="search" />
            </TransactionLink>
            {{ input.value | qtum(8) }} QTUM
          </span>
        </div>
      </template>
    </div>
    <Icon icon="arrow-right" class="column arrow collapse" />
    <div class="column is-half collapse">
      <template v-if="collapsed">
        <div v-for="(output, index) in outputs" class="is-clearfix">
          <AddressLink v-if="output.address" :address="output.address" class="is-pulled-left"
            :highlight="highlightAddress" />
          <span v-else-if="output.scriptPubKey.type === 'nonstandard'">
            {{ $t('transaction.empty_output') }}
          </span>
          <span v-else-if="output.scriptPubKey.type === 'nulldata'">
            {{ $t('transaction.op_return_output') }}
          </span>
          <span v-else class="is-pulled-left">{{ $t('transaction.unparsed_address' )}}</span>
          <span class="is-pulled-right amount" v-if="output.value !== '0'">
            <TransactionLink v-if="output.spentTxId" :transaction="output.spentTxId" :clipboard="false">
              <Icon icon="search" />
            </TransactionLink>
            {{ output.value | qtum(8) }} QTUM
          </span>
          <span class="is-pulled-right" v-else-if="contractInfo[index]">
            {{ $t('transaction.utxo.contract_' + contractInfo[index].type) }}
          </span>
        </div>
      </template>
      <template v-else>
        <div v-for="(output, index) in outputs" class="is-clearfix">
          <AddressLink v-if="output.address" :address="output.address" class="is-pulled-left"
            :highlight="highlightAddress" />
          <span v-else-if="output.scriptPubKey.type === 'nonstandard'">
            {{ $t('transaction.empty_output') }}
          </span>
          <span v-else-if="output.scriptPubKey.type === 'nulldata'">
            {{ $t('transaction.op_return_output') }}
          </span>
          <span v-else class="is-pulled-left">{{ $t('transaction.unparsed_address' )}}</span>
          <span class="is-pulled-right amount" v-if="output.value !== '0'">
            <TransactionLink v-if="output.spentTxId" :transaction="output.spentTxId" :clipboard="false">
              <Icon icon="search" />
            </TransactionLink>
            {{ output.value | qtum(8) }} QTUM
          </span>
          <span class="is-pulled-right" v-else-if="contractInfo[index]">
            {{ $t('transaction.utxo.contract_' + contractInfo[index].type) }}
          </span>
          <div class="is-clearfix"></div>
          <div class="output-script">
            <div>
              <span class="key">{{ $t('transaction.utxo.type') }}</span>
              <span class="value">{{ output.scriptPubKey.type }}</span>
            </div>
            <div v-if="output.scriptPubKey.asm">
              <span class="key">{{ $t('transaction.utxo.script') }}</span>
              <code class="value" :class="{script: contractInfo[index]}"
                @click="$set(showByteCode, index, !showByteCode[index])"><!--
                -->{{ output.scriptPubKey.asm | qtum-script }}<!--
              --></code>
            </div>
            <template v-if="contractInfo[index]">
              <div v-show="showByteCode[index]">
                <span class="key">{{ $t('transaction.utxo.code') }}</span>
                <code class="value break-word">{{ contractInfo[index].code }}</code>
              </div>
              <template v-if="contractInfo[index].type === 'call' && output.abiList && output.abiList.length">
                <pre v-for="{abi, params} in output.abiList"
                  class="contract-call-code break-word"
                  v-html="formatInput(abi, params)"></pre>
              </template>
            </template>
          </div>
        </div>
      </template>
    </div>
    <template v-for="({token, from, to, amount}, index) in qrc20TokenTransfers">
      <div class="column is-full flex-full"></div>
      <AttributeInjector
        class="column collapse token-transfer-list"
        :class="{
          'first-item': index === 0,
          'last-item': index === qrc20TokenTransfers.length - 1
        }">
        <div class="is-clearfix">
          <AddressLink v-if="from" :address="from" class="is-pulled-left" :highlight="highlightAddress" />
          <template v-else>{{ $t('contract.token.mint_tokens') }}</template>
        </div>
        <Icon icon="arrow-right" class="arrow" />
        <div class="is-half">
          <div v-if="to" class="is-clearfix">
            <AddressLink :address="to" class="is-pulled-left" :highlight="highlightAddress" />
            <span class="is-pulled-right amount break-word">
              {{ amount | qrc20(token.decimals) }}
              <AddressLink :address="token.address" :highlight="highlightAddress">
                {{ token.symbol || $t('contract.token.tokens') }}
              </AddressLink>
            </span>
          </div>
          <template v-else>{{ $t('contract.token.burn_tokens') }}</template>
        </div>
      </AttributeInjector>
    </template>
    <template v-for="({token, from, to, tokenId}, index) in qrc721TokenTransfers">
      <div class="column is-full flex-full"></div>
      <AttributeInjector
        class="column collapse token-transfer-list"
        :class="{
          'first-item': index === 0,
          'last-item': index === qrc721TokenTransfers.length - 1
        }">
        <div class="is-clearfix">
          <AddressLink v-if="from" :address="from" class="is-pulled-left" :highlight="highlightAddress" />
          <template v-else>{{ $t('contract.token.mint_tokens') }}</template>
        </div>
        <Icon icon="arrow-right" class="arrow" />
        <div class="is-half">
          <div v-if="to" class="is-clearfix">
            <AddressLink :address="to" class="is-pulled-left" :highlight="highlightAddress" />
            <span class="is-pulled-right amount break-word">
              {{ tokenId }}
              <AddressLink :address="token.address" :highlight="highlightAddress">
                {{ token.symbol || $t('contract.token.tokens') }}
              </AddressLink>
            </span>
          </div>
          <template v-else>{{ $t('contract.token.burn_tokens') }}</template>
        </div>
      </AttributeInjector>
    </template>
    <div class="column is-full has-text-right collapse-bottom" v-if="fees !== '0'">
      <template v-if="fees > 0">
        {{ $t('transaction.fee') }} <span class="amount fee">{{ fees | qtum }} QTUM</span>
      </template>
      <template v-else-if="fees < 0">
        {{ $t('transaction.reward') }} <span class="amount fee">{{ -fees | qtum }} QTUM</span>
      </template>
    </div>
  </div>
</template>

<script>
  import Transaction from '@/models/transaction'

  export default {
    data() {
      return {
        collapsed: !this.detailed,
        showByteCode: this.transaction.outputs.map(output => false)
      }
    },
    props: {
      transaction: {type: Object, required: true},
      detailed: {type: Boolean, default: false},
      highlightAddress: {type: [String, Array], default: () => []}
    },
    computed: {
      blockchain() {
        return this.$store.state.blockchain
      },
      id() {
        return this.transaction.id
      },
      inputs() {
        return this.transaction.inputs
      },
      outputs() {
        return this.transaction.outputs
      },
      fees() {
        return this.transaction.fees
      },
      confirmations() {
        return this.transaction.blockHeight == null
          ? 0
          : this.blockchain.height - this.transaction.blockHeight + 1
      },
      qrc20TokenTransfers() {
        return this.transaction.qrc20TokenTransfers
      },
      qrc721TokenTransfers() {
        return this.transaction.qrc721TokenTransfers
      },
      contractInfo() {
        return this.outputs.map(output => {
          if (this.detailed) {
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
            default:
              return null
            }
          } else {
            switch (output.scriptPubKey.type) {
            case 'create':
              return {type: 'create'}
            case 'call':
              return {type: 'call'}
            default:
              return null
            }
          }
        })
      }
    },
    methods: {
      formatInput(abi, params) {
        if (params.length === 0) {
          return abi.name + '()'
        } else {
          return abi.name + '(\n'
            + abi.inputs.map((input, index) => {
              if (input.name) {
                return '  ' + input.name + ' = ' + params[index]
              } else {
                return '  ' + params[index]
              }
            }).join(',\n')
            + '\n)'
        }
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
    },
    mounted() {
      if (this.transaction.confirmations) {
        return
      }
      this.$websocket.subscribe('transaction/' + this.id)
      this.$options.subscribing = true
      this.$websocket.on('transaction/' + this.id, transaction => {
        this.$emit('transaction-change', transaction)
        this.$websocket.unsubscribe('transaction/' + this.id)
        this.$options.subscribing = false
      })
    },
    beforeDestroy() {
      if (this.$options.subscribing) {
        this.$websocket.unsubscribe('transaction/' + this.id)
      }
    },
    subscribing: false
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

  .tag:link {
    text-decoration: none;
  }

  .tag, .timestamp {
    margin-left: 1em;
  }

  .confirmation-1 {
    background-color: #fa4035;
    color: white;
  }
  .confirmation-2 {
    background-color: #f56f33;
    color: white;
  }
  .confirmation-3 {
    background-color: #f19d31;
    color: white;
  }
  .confirmation-4 {
    background-color: #ecca2f;
  }
  .confirmation-5 {
    background-color: #dae72c;
  }
  .confirmation-6 {
    background-color: #a6e32a;
  }
  .confirmation-7 {
    background-color: #74de28;
    color: white;
  }
  .confirmation-8 {
    background-color: #43da26;
    color: white;
  }
  .confirmation-9 {
    background-color: #24d535;
    color: white;
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
    .script {
      cursor: pointer;
    }
    .contract-call-code {
      padding: 0.5em;
      white-space: pre-wrap;
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
