<template>
  <section class="container">
    <div class="card transaction-summary">
      <div class="card-header">
        <div class="card-header-icon">
          <span class="fa fa-fw fa-info"></span>
        </div>
        <h3 class="card-header-title">{{ $t('transaction.summary') }}</h3>
      </div>
      <div class="card-body">
        <div class="columns">
          <div class="column is-one-quarter has-text-right">Transaction Hash</div>
          <div class="column">{{ id }}</div>
        </div>
        <div class="columns">
          <div class="column is-one-quarter has-text-right">Included in Block</div>
          <div class="column">
            <nuxt-link :to="'/block/' + blockHeight">
              {{ blockHeight }} ({{ block.hash }})
            </nuxt-link>
          </div>
        </div>
        <div class="columns">
          <div class="column is-one-quarter has-text-right">Transaction Size</div>
          <div class="column">{{ size }} bytes</div>
        </div>
        <div class="columns">
          <div class="column is-one-quarter has-text-right">Timestamp</div>
          <div class="column">
            {{ $moment(time * 1000).fromNow() }}
            ( {{ $moment(time * 1000).toString() }} )
          </div>
        </div>
        <div class="columns">
          <div class="column is-one-quarter has-text-right">Confirmations</div>
          <div class="column">{{ confirmations }}</div>
        </div>
        <div class="columns" v-if="fees > 0">
          <div class="column is-one-quarter has-text-right">Transaction Fee</div>
          <div class="column">{{ fees | qtum }} QTUM</div>
        </div>

        <QtumTransaction :transaction="{txid: id, vin, vout, fees}"></QtumTransaction>
      </div>
    </div>
  </section>
</template>

<script>
  import Block from '@/models/block'
  import Transaction from '@/models/transaction'
  import {RequestError} from '@/services/qtumscan-api'
  import QtumTransaction from '@/components/transaction.vue'

  export default {
    head() {
      return {title: `Transaction ${this.id} -- QtumScan`}
    },
    data() {
      return {
        blockHeight: 0,
        block: {},
        time: 0,
        size: 0,
        isCoinbase: false,
        fees: 0,
        confirmations: 0,
        vin: [],
        vout: []
      }
    },
    async asyncData({params, error}) {
      try {
        let transaction = await Transaction.get(params.id)
        let blockHash = await Block.getHash(transaction.blockHeight)
        let block = await Block.get(blockHash)
        return {
          blockHeight: transaction.blockHeight,
          time: transaction.time,
          size: transaction.size,
          isCoinbase: transaction.isCoinbase,
          fees: transaction.fees,
          confirmations: transaction.confirmations,
          vin: transaction.vin,
          vout: transaction.vout,
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
      }
    },
    components: {QtumTransaction}
  }
</script>

<style lang="less" scoped>
  .card {
    margin-top: 1em;
    margin-bottom: 1em;
    &:first-child {
      margin-top: 0.5em;
    }
  }

  .transaction-summary {
    .columns:first-child {
      margin-top: 0.25em;
    }
    .columns:last-child {
      margin-bottom: 0.25em;
    }
    .column {
      padding-top: 0.25em;
      padding-bottom: 0.25em;
    }
    .column:first-child {
      font-weight: bold;
    }
  }
</style>
