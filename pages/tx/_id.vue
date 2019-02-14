<template>
  <section class="container">
    <div class="card section-card">
      <div class="card-header">
        <div class="card-header-icon">
          <Icon icon="list-alt" fixedWidth />
        </div>
        <h3 class="card-header-title">{{ $t('transaction.summary') }}</h3>
      </div>
      <div class="card-body info-table">
        <div class="columns">
          <div class="column info-title">{{ $t('transaction.transaction_id') }}</div>
          <div class="column info-value monospace">
            <TransactionLink :transaction="id" plain />
          </div>
        </div>
        <div class="columns" v-if="id !== hash">
          <div class="column info-title">{{ $t('transaction.transaction_hash') }}</div>
          <div class="column info-value monospace">
            <TransactionLink :transaction="id" plain :clipboard="hash">{{ hash }}</TransactionLink>
          </div>
        </div>
        <div class="columns" v-if="blockHash">
          <div class="column info-title">{{ $t('transaction.included_in_block') }}</div>
          <div class="column info-value">
            <BlockLink :block="blockHeight" :clipboard="blockHash">
              {{ blockHeight }} ({{ blockHash }})
            </BlockLink>
          </div>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('transaction.transaction_size') }}</div>
          <div class="column info-value">{{ size.toLocaleString() }} bytes</div>
        </div>
        <div class="columns" v-if="timestamp">
          <div class="column info-title">{{ $t('transaction.timestamp') }}</div>
          <div class="column info-value">
            <FromNow :timestamp="timestamp" /> ({{ timestamp | timestamp }})
          </div>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('transaction.confirmation') }}</div>
          <div class="column info-value">{{ confirmations }}</div>
        </div>
        <div class="columns" v-if="fees > 0">
          <div class="column info-title">{{ $t('transaction.transaction_fee') }}</div>
          <div class="column info-value monospace">{{ fees | qtum }} QTUM</div>
        </div>

        <Transaction
          :transaction="{
            id, blockHeight, timestamp,
            inputs, outputs, refundValue, fees,
            contractSpends,
            qrc20TokenTransfers, qrc721TokenTransfers
          }"
          detailed
          @transaction-change="refresh" />

        <div class="columns">
          <div class="column">
            <div v-for="receipt in receipts" class="receipt-item">
              <div class="columns">
                <div class="column info-title">{{ $t('transaction.receipt.gas_used') }}</div>
                <div class="column info-value monospace">{{ receipt.gasUsed.toLocaleString() }}</div>
              </div>
              <div class="columns" v-if="receipt.contractAddressHex !== '0'.repeat(40)">
                <div class="column info-title">{{ $t('transaction.receipt.contract_address') }}</div>
                <div class="column info-value">
                  <AddressLink :address="receipt.contractAddressHex" />
                </div>
              </div>
              <div class="columns" v-if="receipt.excepted !== 'None'">
                <div class="column info-title">{{ $t('transaction.receipt.excepted') }}</div>
                <div class="column info-value">{{ receipt.excepted }}</div>
              </div>
              <div class="columns" v-if="receipt.logs.length">
                <div class="column info-title">{{ $t('transaction.receipt.event_logs') }}</div>
                <div class="column info-value">
                  <ul v-for="log in receipt.logs" class="event-log">
                    <li>
                      <span class="key">{{ $t('transaction.receipt.address') }}</span>
                      <AddressLink :address="log.addressHex" />
                    </li>
                    <li>
                      <span class="key">{{ $t('transaction.receipt.topics') }}</span>
                      <ul class="topic-list monospace">
                        <li v-for="topic in log.topics">{{ topic }}</li>
                      </ul>
                    </li>
                    <li>
                      <span class="key">{{ $t('transaction.receipt.data') }}</span>
                      <span class="monospace">{{ log.data }}</span>
                    </li>
                    <li v-if="log.abiList && log.abiList.length">
                      <ul>
                        <pre v-for="{abi, params} in log.abiList"
                          class="contract-event-code"
                          v-html="formatEvent(abi, params)"></pre>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import Block from '@/models/block'
  import Transaction from '@/models/transaction'
  import {RequestError} from '@/services/qtuminfo-api'

  export default {
    head() {
      return {
        title: this.$t('blockchain.transaction') + ' ' + this.id
      }
    },
    data() {
      return {
        id: '',
        hash: '',
        isCoinbase: false,
        fees: '0',
        inputs: [],
        outputs: [],
        refundValue: '0',
        blockHeight: null,
        blockHash: null,
        timestamp: null,
        size: 0,
        contractSpends: [],
        qrc20TokenTransfers: [],
        qrc721TokenTransfers: [],
      }
    },
    async asyncData({req, params, error}) {
      try {
        let transaction = await Transaction.get(params.id, {ip: req && req.ip})
        return {
          id: transaction.id,
          hash: transaction.hash,
          isCoinbase: transaction.isCoinbase,
          fees: transaction.fees,
          inputs: transaction.inputs,
          outputs: transaction.outputs,
          refundValue: transaction.refundValue,
          blockHeight: transaction.blockHeight,
          blockHash: transaction.blockHash,
          timestamp: transaction.timestamp,
          size: transaction.size,
          contractSpends: transaction.contractSpends,
          qrc20TokenTransfers: transaction.qrc20TokenTransfers,
          qrc721TokenTransfers: transaction.qrc721TokenTransfers
        }
      } catch (err) {
        if (err instanceof RequestError) {
          if (err.code === 404) {
            error({statusCode: 404, message: `Transaction ${param.id} not found`})
          } else {
            error({statusCode: err.code, message: err.message})
          }
        } else {
          error({statusCode: 500, message: err.message})
        }
      }
    },
    computed: {
      blockchain() {
        return this.$store.state.blockchain
      },
      confirmations() {
        return this.blockHeight == null ? 0 : this.blockchain.height - this.blockHeight + 1
      },
      receipts() {
        return this.outputs.map(output => output.receipt).filter(Boolean)
      }
    },
    methods: {
      refresh(transaction) {
        this.outputs = transaction.outputs
        this.blockHeight = transaction.blockHeight
        this.blockHash = transaction.blockHash
        this.timestamp = transaction.timestamp
        this.fees = transaction.fees
        this.refundValue = transaction.refundValue
        this.contractSpends = transaction.contractSpends
        this.qrc20TokenTransfers = transaction.qrc20TokenTransfers
        this.qrc721TokenTransfers = transaction.qrc721TokenTransfers
      },
      splitData(data) {
        let chunks = data.length / 64
        let list = []
        for (let i = 0; i < chunks; ++i) {
          list.push(data.slice(i * 64, (i + 1) * 64))
        }
        return list
      },
      formatEvent(abi, params) {
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
    }
  }
</script>

<style lang="less" scoped>
  .receipt-item::before {
    display: block;
    height: 1px;
    background-color: #ccc;
    content: "";
  }
  .event-log {
    display: inline-block;
    &:not(:first-child) {
      margin-top: 0.5em;
    }
    padding: 0.5em 1em;
    border: 1px solid #ccc;
    .key {
      display: inline-block;
      margin-right: 0.5em;
      font-weight: bold;
    }
  }
  .topic-list, .data-list {
    list-style-type: disc;
    list-style-position: inside;
  }
  .contract-event-code {
    padding: 0.5em;
    white-space: pre-wrap;
  }
</style>
