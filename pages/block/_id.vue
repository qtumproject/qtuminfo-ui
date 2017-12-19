<template>
  <section class="container">
    <div class="card section-card">
      <div class="card-header">
        <div class="card-header-icon">
          <span class="fa fa-fw fa-info"></span>
        </div>
        <h3 class="card-header-title">{{ $t('block.summary') }}</h3>
      </div>
      <div class="card-body info-table">
        <div class="columns">
          <div class="column info-title">Block Height</div>
          <div class="column info-value">{{ height }}</div>
        </div>
        <div class="columns">
          <div class="column info-title">Block Hash</div>
          <div class="column info-value">{{ hash }}</div>
        </div>
        <div class="columns">
          <div class="column info-title">Block Size</div>
          <div class="column info-value">{{ size }} bytes</div>
        </div>
        <div class="columns">
          <div class="column info-title">Timestamp</div>
          <div class="column info-value">
            {{ $moment(time * 1000).fromNow() }}
            ( {{ $moment(time * 1000).toString() }} )
          </div>
        </div>
        <div class="columns">
          <div class="column info-title">Block Reward</div>
          <div class="column info-value">{{ reward | qtum }} QTUM</div>
        </div>
        <div class="columns">
          <div class="column info-title">Difficulty</div>
          <div class="column info-value">{{ difficulty }}</div>
        </div>
        <div class="columns">
          <div class="column info-title">Merkle Root</div>
          <div class="column info-value">{{ merkleRoot }}</div>
        </div>
        <div class="columns" v-if="minedBy">
          <div class="column info-title">Mined By</div>
          <nuxt-link :to="'/address/' + minedBy" class="column info-value">{{ minedBy }}</nuxt-link>
        </div>
        <div class="columns">
          <div class="column info-title">Transactions</div>
          <div class="column info-value">{{ transactions.length }}</div>
        </div>
        <div class="columns" v-if="previousBlockHash && previousBlockHash != '0'.repeat(64)">
          <div class="column info-title">Previous Block</div>
          <nuxt-link :to="'/block/' + (height - 1)" class="column info-value">{{ previousBlockHash }}</nuxt-link>
        </div>
        <div class="columns" v-if="nextBlockHash">
          <div class="column info-title">Next Block</div>
          <nuxt-link :to="'/block/' + (height + 1)" class="column info-value">{{ nextBlockHash }}</nuxt-link>
        </div>
      </div>
    </div>

    <div class="card section-card transaction-list" v-if="transactions.length">
      <div class="card-header">
        <div class="card-header-icon">
          <span class="fa fa-list-alt"></span>
        </div>
        <div class="card-header-title">Transactions</div>
      </div>
      <div class="card-body">
        <QtumTransaction v-for="transaction in transactions" :key="transaction.txid"
          :transaction="transaction"></QtumTransaction>
      </div>
    </div>
  </section>
</template>

<script>
  import Block from '@/models/block'
  import Transaction from '@/models/transaction'
  import QtumTransaction from '@/components/transaction.vue'
  import RequestError from '@/services/qtumscan-api'

  export default {
    head() {
      return {title: `Block #${this.height} -- QtumScan`}
    },
    data() {
      return {
        height: 0,
        hash: 0,
        time: 0,
        size: 0,
        reward: 0,
        difficulty: 0,
        merkleRoot: '',
        minedBy: null,
        previousBlockHash: null,
        nextBlockHash: null,
        transactions: []
      }
    },
    async asyncData({params, error}) {
      let id = params.id
      let hash = id
      if (/^(0|[1-9]\d{0,9})$/.test(id)) {
        try {
          hash = await Block.getHash(id)
        } catch (err) {
        }
      }
      try {
        let block = await Block.get(hash)
        let transactions = block.height == 0 ? [] : await Promise.all(block.tx.map(Transaction.get))
        return {
          height: block.height,
          hash: block.hash,
          time: block.time,
          size: block.size,
          reward: block.reward,
          difficulty: block.difficulty,
          merkleRoot: block.merkleRoot,
          minedBy: block.minedBy || null,
          previousBlockHash: block.previousBlockHash || null,
          nextBlockHash: block.nextBlockHash || null,
          transactions
        }
      } catch (err) {
        if (err instanceof RequestError) {
          if (err.code === 404) {
            error({statusCode: 404, message: `Block ${id} not found`})
          } else {
            error({statusCode: err.code, message: err.message})
          }
        } else {
          throw err
        }
      }
    },
    components: {QtumTransaction}
  }
</script>

<style lang="less" src="@/styles/card.less"></style>
<style lang="less" src="@/styles/info-table.less"></style>
