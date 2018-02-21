<template>
  <section class="container">
    <div class="card section-card">
      <div class="card-header">
        <div class="card-header-icon">
          <Icon icon="list-alt" fixed-width></Icon>
        </div>
        <h3 class="card-header-title">{{ $t('transaction.summary') }}</h3>
      </div>
      <div class="card-body info-table">
        <div class="columns">
          <div class="column info-title">{{ $t('transaction.transaction_id') }}</div>
          <div class="column info-value monospace">{{ id }}</div>
        </div>
        <div class="columns" v-if="id !== hash">
          <div class="column info-title">{{ $t('transaction.transaction_hash') }}</div>
          <div class="column info-value monospace">{{ hash }}</div>
        </div>
        <div class="columns" v-if="block">
          <div class="column info-title">{{ $t('transaction.included_in_block') }}</div>
          <div class="column info-value">
            <nuxt-link :to="'/block/' + block.height">
              {{ block.height }} ({{ block.hash }})
            </nuxt-link>
          </div>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('transaction.transaction_size') }}</div>
          <div class="column info-value">{{ size.toLocaleString() }} bytes</div>
        </div>
        <div class="columns" v-if="block">
          <div class="column info-title">{{ $t('transaction.timestamp') }}</div>
          <div class="column info-value">
            <FromNow :timestamp="block.timestamp"></FromNow> ({{ block.timestamp | timestamp }})
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
            txid: id, blockHeight: block && block.height, timestamp: block && block.timestamp,
            vin, vout, fees, tokenTransfers
          }"
          @transaction-change="refresh"
        ></Transaction>

        <div class="columns">
          <div class="column">
            <div v-for="receipt in receipts" class="receipt-item">
              <div class="columns">
                <div class="column info-title">{{ $t('transaction.receipt.gas_used') }}</div>
                <div class="column info-value monospace">{{ receipt.gasUsed.toLocaleString() }}</div>
              </div>
              <div class="columns">
                <div class="column info-title">{{ $t('transaction.receipt.contract_address') }}</div>
                <div class="column info-value">
                  <AddressLink :address="receipt.contractAddress"></AddressLink>
                </div>
              </div>
              <div class="columns" v-if="receipt.logs.length">
                <div class="column info-title">{{ $t('transaction.receipt.event_logs') }}</div>
                <div class="column info-value">
                  <ul v-for="log in receipt.logs" class="event-log">
                    <li>
                      <span class="key">{{ $t('transaction.receipt.address') }}</span>
                      <AddressLink :address="log.address"></AddressLink>
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
      return {title: `Transaction ${this.id} -- qtum.info`}
    },
    data() {
      return {
        block: null,
        hash: '',
        size: 0,
        isCoinbase: false,
        fees: 0,
        vin: [],
        vout: [],
        receipts: [],
        tokenTransfers: []
      }
    },
    async asyncData({params, error}) {
      try {
        let transaction = await Transaction.get(params.id)
        let block = null
        if (transaction.blockHeight != null) {
          block = await Block.get(transaction.blockHash)
        }
        return {
          hash: transaction.hash,
          size: transaction.size,
          isCoinbase: transaction.isCoinbase,
          fees: transaction.fees,
          vin: transaction.vin,
          vout: transaction.vout,
          receipts: transaction.receipts,
          tokenTransfers: transaction.tokenTransfers,
          block
        }
      } catch (err) {
        if (err instanceof RequestError) {
          if (err.code === 404) {
            error({statusCode: 404, message: `Transaction ${param.id} not found`})
          } else {
            error({statusCode: err.code, message: err.message})
          }
        } else {
          throw err
        }
      }
    },
    computed: {
      id() {
        return this.$route.params.id
      },
      blockchain() {
        return this.$store.state.blockchain
      },
      confirmations() {
        return this.block ? this.blockchain.height - this.block.height + 1 : 0
      }
    },
    methods: {
      async refresh(transaction) {
        this.block = transaction.block
        this.timestamp = transaction.block.timestamp
        this.receipts = transaction.receipts
        this.tokenTransfers = transaction.tokenTransfers
      },
      splitData(data) {
        let chunks = data.length / 64
        let list = []
        for (let i = 0; i < chunks; ++i) {
          list.push(data.slice(i * 64, (i + 1) * 64))
        }
        return list
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
</style>
