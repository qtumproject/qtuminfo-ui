<template>
  <div class="columns is-multiline transaction-item">
    <div class="column is-full is-clearfix">
      <div class="pull-left collapse-bottom">
        <Icon
          :icon="collapsed ? 'chevron-right' : 'chevron-down'" fixedWidth
          class="toggle-collapse"
          @click="collapsed = !collapsed" />
        <TransactionLink :transaction="id" />
      </div>
      <div class="pull-right">
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
          <AddressLink v-if="input.address" :address="input.address" class="pull-left"
            :highlight="highlightAddress" />
          <span v-else class="pull-left">{{ $t('transaction.unparsed_address' )}}</span>
          <span class="pull-right amount">
            {{ input.value | qtum(8) }} QTUM
          </span>
        </div>
      </template>
    </div>
    <Icon icon="arrow-right" class="column arrow collapse"></Icon>
    <div class="column is-half collapse">
      <template v-if="collapsed">
        <div v-for="output in outputs" class="is-clearfix">
          <AddressLink v-if="output.address" :address="output.address" class="pull-left"
            :highlight="highlightAddress" />
          <span v-else-if="output.scriptPubKey.type === 'nonstandard'">
            {{ $t('transaction.empty_output') }}
          </span>
          <span v-else-if="output.scriptPubKey.type === 'nulldata'">
            {{ $t('transaction.op_return_output') }}
          </span>
          <span v-else class="pull-left">{{ $t('transaction.unparsed_address' )}}</span>
          <span class="pull-right amount" v-if="output.value !== '0'">
            {{ output.value | qtum(8) }} QTUM
          </span>
          <span class="pull-right" v-else-if="contractInfo">
            {{ $t('transaction.utxo.contract_' + contractInfo.type) }}
          </span>
        </div>
      </template>
      <template v-else>
        <div v-for="output in outputs" class="is-clearfix">
          <AddressLink v-if="output.address" :address="output.address" class="pull-left"
            :highlight="highlightAddress" />
          <span v-else-if="output.scriptPubKey.type === 'nonstandard'">
            {{ $t('transaction.empty_output') }}
          </span>
          <span v-else-if="output.scriptPubKey.type === 'nulldata'">
            {{ $t('transaction.op_return_output') }}
          </span>
          <span v-else class="pull-left">{{ $t('transaction.unparsed_address' )}}</span>
          <span class="pull-right amount" v-if="output.value !== '0'">
            {{ output.value | qtum(8) }} QTUM
          </span>
          <span class="pull-right" v-else-if="contractInfo">
            {{ $t('transaction.utxo.contract_' + contractInfo.type) }}
          </span>
          <div class="is-clearfix"></div>
          <div class="output-script">
            <div>
              <span class="key">{{ $t('transaction.utxo.type') }}</span>
              <span class="value">{{ output.scriptPubKey.type }}</span>
            </div>
            <div v-if="output.scriptPubKey.asm">
              <span class="key">{{ $t('transaction.utxo.script') }}</span>
              <code class="value">{{ output.scriptPubKey.asm | qtum-script }}</code>
            </div>
          </div>
        </div>
      </template>
    </div>
    <template v-for="({token, from, to, amount}, index) in tokenTransfers">
      <div class="column is-full flex-full"></div>
      <AttributeInjector
        class="column collapse token-transfer-list"
        :class="{
          'first-item': index === 0,
          'last-item': index === tokenTransfers.length - 1
        }">
        <div class="is-clearfix">
          <AddressLink v-if="from" :address="from" class="pull-left" :highlight="highlightAddress" />
          <template v-else>{{ $t('contract.token.mint_tokens') }}</template>
        </div>
        <Icon icon="arrow-right" class="arrow"></Icon>
        <div class="is-half">
          <div v-if="to" class="is-clearfix">
            <AddressLink :address="to" class="pull-left" :highlight="highlightAddress" />
            <span class="pull-right amount break-word">
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
    <code class="column is-full break-word" v-if="contractInfo && !collapsed">{{ contractInfo.code }}</code>
    <div class="column is-full has-text-right collapse-bottom" v-if="fees">
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
        collapsed: true
      }
    },
    props: {
      transaction: {type: Object, required: true},
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
        return this.transaction.vin
      },
      outputs() {
        return this.transaction.vout
      },
      fees() {
        return this.transaction.fees
      },
      confirmations() {
        return this.transaction.blockHeight == null
          ? 0
          : this.blockchain.height - this.transaction.blockHeight + 1
      },
      tokenTransfers() {
        return this.transaction.tokenTransfers
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
