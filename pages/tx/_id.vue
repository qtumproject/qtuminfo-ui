<template>
  <section class="container">
    <div class="card section-card">
      <div class="card-header">
        <div class="card-header-icon">
          <Icon icon="info" fixed-width></Icon>
        </div>
        <h3 class="card-header-title">{{ $t('transaction.summary') }}</h3>
      </div>
      <div class="card-body info-table">
        <div class="columns">
          <div class="column info-title">{{ $t('transaction.transaction_id') }}</div>
          <div class="column info-value">{{ id }}</div>
        </div>
        <div class="columns" v-if="id !== hash">
          <div class="column info-title">{{ $t('transaction.transaction_hash') }}</div>
          <div class="column info-value">{{ hash }}</div>
        </div>
        <div class="columns" v-if="block">
          <div class="column info-title">{{ $t('transaction.included_in_block') }}</div>
          <div class="column info-value">
            <nuxt-link :to="'/block/' + blockHeight">
              {{ blockHeight }} ({{ block.hash }})
            </nuxt-link>
          </div>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('transaction.transaction_size') }}</div>
          <div class="column info-value">{{ size.toLocaleString() }} bytes</div>
        </div>
        <div class="columns" v-if="timestamp">
          <div class="column info-title">{{ $t('transaction.timestamp') }}</div>
          <div class="column info-value">
            <FromNow :timestamp="timestamp"></FromNow> ({{ timestamp | timestamp }})
          </div>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('transaction.confirmation') }}</div>
          <div class="column info-value">{{ confirmations }}</div>
        </div>
        <div class="columns" v-if="fees > 0">
          <div class="column info-title">{{ $t('transaction.transaction_fee') }}</div>
          <div class="column info-value">{{ fees | qtum }} QTUM</div>
        </div>

        <QtumTransaction :transaction="{
          txid: id, blockHeight, timestamp, vin, vout, fees, tokenTransfers
        }"></QtumTransaction>
      </div>
    </div>
  </section>
</template>

<script>
  import Block from '@/models/block'
  import Transaction from '@/models/transaction'
  import {RequestError} from '@/services/qtuminfo-api'
  import QtumTransaction from '@/components/transaction.vue'

  export default {
    head() {
      return {title: `Transaction ${this.id} -- qtum.info`}
    },
    data() {
      return {
        blockHeight: null,
        block: null,
        hash: '',
        timestamp: 0,
        size: 0,
        isCoinbase: false,
        fees: 0,
        vin: [],
        vout: [],
        tokenTransfers: []
      }
    },
    async asyncData({params, error}) {
      try {
        let transaction = await Transaction.get(params.id)
        let block = null
        if (transaction.blockHeight != null) {
          let blockHash = await Block.getHash(transaction.blockHeight)
          block = await Block.get(blockHash)
        }
        return {
          blockHeight: transaction.blockHeight,
          hash: transaction.hash,
          timestamp: transaction.timestamp,
          size: transaction.size,
          isCoinbase: transaction.isCoinbase,
          fees: transaction.fees,
          vin: transaction.vin,
          vout: transaction.vout,
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
        return this.blockHeight == null ? 0 : this.blockchain.height - this.blockHeight + 1
      }
    },
    mounted() {
      this.$websocket.send({type: 'subscribe', data: 'block'})
      this.$websocket.on('block', block => {
        if (block.tx.includes(this._id)) {
          this.blockHeight = block.height
          this.timestamp = block.header.timestamp
          this.block = block
        }
      })
    },
    beforeDestroy() {
      this.$websocket.send({type: 'subscribe', data: 'block'})
    },
    components: {QtumTransaction}
  }
</script>

<style lang="less" src="@/styles/card.less"></style>
<style lang="less" src="@/styles/info-table.less"></style>
