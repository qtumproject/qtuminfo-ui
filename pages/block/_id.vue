<template>
  <section class="container">
    <div class="card block-summary">
      <div class="card-header">
        <div class="card-header-icon">
          <span class="fa fa-fw fa-info"></span>
        </div>
        <h3 class="card-header-title">{{ $t('block.summary') }}</h3>
      </div>
      <div class="card-body">
        <div class="columns">
          <div class="column is-one-quarter has-text-right">Block Height</div>
          <div class="column">{{ height }}</div>
        </div>
        <div class="columns">
          <div class="column is-one-quarter has-text-right">Block Hash</div>
          <div class="column">{{ hash }}</div>
        </div>
        <div class="columns">
          <div class="column is-one-quarter has-text-right">Block Size</div>
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
          <div class="column is-one-quarter has-text-right">Block Reward</div>
          <div class="column">{{ reward | qtum }} QTUM</div>
        </div>
        <div class="columns">
          <div class="column is-one-quarter has-text-right">Difficulty</div>
          <div class="column">{{ difficulty }}</div>
        </div>
        <div class="columns">
          <div class="column is-one-quarter has-text-right">Merkle Root</div>
          <div class="column">{{ merkleRoot }}</div>
        </div>
        <div class="columns" v-if="minedBy">
          <div class="column is-one-quarter has-text-right">Mined By</div>
          <nuxt-link :to="'/address/' + minedBy" class="column">{{ minedBy }}</nuxt-link>
        </div>
        <div class="columns">
          <div class="column is-one-quarter has-text-right">Transactions</div>
          <div class="column">{{ transactions.length }}</div>
        </div>
        <div class="columns" v-if="previousBlockHash && previousBlockHash != '0'.repeat(64)">
          <div class="column is-one-quarter has-text-right">Previous Block</div>
          <nuxt-link :to="'/block/' + (height - 1)" class="column">{{ previousBlockHash }}</nuxt-link>
        </div>
        <div class="columns" v-if="nextBlockHash">
          <div class="column is-one-quarter has-text-right">Next Block</div>
          <nuxt-link :to="'/block/' + (height + 1)" class="column">{{ nextBlockHash }}</nuxt-link>
        </div>
      </div>
    </div>

    <div class="card transaction-list" v-if="transactions.length">
      <div class="card-header">
        <div class="card-header-icon">
          <span class="fa fa-list-alt"></span>
        </div>
        <div class="card-header-title">Transactions</div>
      </div>
      <div class="card-body">
        <qtum-transaction v-for="transaction in transactions" :key="transaction.txid"
          :transaction="transaction"></qtum-transaction>
      </div>
    </div>
  </section>
</template>

<script>
  import Block from '@/models/block'
  import Transaction from '@/models/transaction'
  import QtumTransaction from '@/components/transaction.vue'

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
      if (/^(0|[1-9]\d*)$/.test(id)) {
        try {
          hash = await Block.getHash(id)
        } catch (err) {
        }
      }
      try {
        let block = await Block.get(hash)
        let transactions = block.height == 0 ? [] : await Promise.all(
          block.tx.map(async hash => Transaction.get(hash))
        )
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
        error({statusCode: 404, message: `Block ${id} not found`})
      }
    },
    components: {
      'qtum-transaction': QtumTransaction
    }
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

  .block-summary {
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
