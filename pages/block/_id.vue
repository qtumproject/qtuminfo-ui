<template>
  <section class="container">
    <div class="card section-card">
      <div class="card-header">
        <div class="card-header-icon">
          <Icon icon="cubes" fixed-width></Icon>
        </div>
        <h3 class="card-header-title">{{ $t('block.summary') }}</h3>
      </div>
      <div class="card-body info-table">
        <div class="columns">
          <div class="column info-title">{{ $t('block.block_height') }}</div>
          <div class="column info-value">{{ height }}</div>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('block.block_hash') }}</div>
          <div class="column info-value monospace">{{ hash }}</div>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('block.block_size') }}</div>
          <div class="column info-value">{{ size.toLocaleString() }} {{ $t('block.bytes') }}</div>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('block.block_weight') }}</div>
          <div class="column info-value">{{ weight.toLocaleString() }} {{ $t('block.bytes') }}</div>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('block.timestamp') }}</div>
          <div class="column info-value">
            <FromNow :timestamp="timestamp"></FromNow> ({{ timestamp | timestamp }})
          </div>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('block.block_reward') }}</div>
          <div class="column info-value monospace">{{ reward | qtum }} QTUM</div>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('block.difficulty') }}</div>
          <div class="column info-value">{{ difficulty }}</div>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('block.merkle_root') }}</div>
          <div class="column info-value monospace">{{ merkleRoot }}</div>
        </div>
        <div class="columns" v-if="minedBy">
          <div class="column info-title">{{ $t('block.mined_by') }}</div>
          <div class="column info-value">
            <AddressLink :address="minedBy"></AddressLink>
          </div>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('block.transactions') }}</div>
          <div class="column info-value">{{ transactions.length }}</div>
        </div>
        <div class="columns" v-if="previousBlockHash && previousBlockHash != '0'.repeat(64)">
          <div class="column info-title">{{ $t('block.previous_block') }}</div>
          <nuxt-link :to="'/block/' + (height - 1)" class="column info-value">{{ previousBlockHash }}</nuxt-link>
        </div>
        <div class="columns" v-if="nextBlockHash">
          <div class="column info-title">{{ $t('block.next_block') }}</div>
          <nuxt-link :to="'/block/' + (height + 1)" class="column info-value">{{ nextBlockHash }}</nuxt-link>
        </div>
      </div>
    </div>

    <div class="card section-card transaction-list" ref="transaction-list">
      <div class="card-header">
        <div class="card-header-icon">
          <Icon icon="list-alt" fixed-width></Icon>
        </div>
        <div class="card-header-title">{{ $tc('blockchain.transaction', 2) }}</div>
      </div>
      <div class="card-body">
        <Pagination v-if="pages > 1" :pages="pages" :current-page="currentPage" :get-link="getLink"></Pagination>
        <Transaction v-for="transaction in transactions" :key="transaction.txid"
          :transaction="transaction"></Transaction>
        <Pagination v-if="pages > 1" :pages="pages" :current-page="currentPage" :get-link="getLink"></Pagination>
      </div>
    </div>
  </section>
</template>

<script>
  import Block from '@/models/block'
  import Transaction from '@/models/transaction'
  import RequestError from '@/services/qtuminfo-api'
  import {scrollIntoView} from '@/utils/dom'

  export default {
    head() {
      return {
        title: this.$t('blockchain.block') + ' #' + this.height
      }
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
        tx: [],
        totalCount: 0,
        transactions: [],
        currentPage: Number(this.$route.query.page || 1)
      }
    },
    async asyncData({params, query, redirect, error}) {
      let id = params.id
      try {
        if (query.page && !/^[1-9]\d*$/.test(query.page)) {
          redirect(`/block/${params.id}`)
        }
        let block = await Block.get(id)
        let page = Number(query.page || 1)
        if (page > 1 && block.tx.length <= (page - 1) * 20) {
          redirect(`/block/${params.id}`, {page: Math.ceil(block.tx.length / 20)})
        }
        let transactions = await Transaction.get(block.tx.slice((page - 1) * 20, page * 20))
        return {
          height: block.height,
          hash: block.hash,
          timestamp: block.timestamp,
          size: block.size,
          weight: block.weight,
          reward: block.reward,
          difficulty: block.difficulty,
          merkleRoot: block.merkleRoot,
          minedBy: block.minedBy || null,
          previousBlockHash: block.previousBlockHash || null,
          nextBlockHash: block.nextBlockHash || null,
          tx: block.tx,
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
    computed: {
      pages() {
        return Math.ceil(this.tx.length / 20)
      }
    },
    methods: {
      getLink(page) {
        return {name: 'block-id', params: {id: this.height}, query: {page}}
      }
    },
    async beforeRouteUpdate(to, from, next) {
      let page = Number(to.query.page || 1)
      if (page > this.pages && this.pages > 1) {
        this.$router.push({
          name: 'block-id',
          params: {id: this.height},
          query: {page: Math.ceil(this.tx.length / 20)}
        })
        return
      }
      this.transactions = await Transaction.get(this.tx.slice((page - 1) * 20, page * 20))
      this.currentPage = page
      next()
      scrollIntoView(this.$refs['transaction-list'])
    }
  }
</script>

<style lang="less" scoped>
  .pagination {
    padding: 1em;
  }
</style>
