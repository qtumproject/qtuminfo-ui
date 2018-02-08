<template>
  <section class="container">
    <div class="card section-card">
      <div class="card-header">
        <div class="card-header-icon">
          <Icon icon="info" fixed-width></Icon>
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
          <AddressLink :address="minedBy" class="column info-value"></AddressLink>
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

    <div class="card section-card transaction-list" v-if="transactions.length">
      <div class="card-header">
        <div class="card-header-icon">
          <Icon icon="list-alt" fixed-width></Icon>
        </div>
        <div class="card-header-title">{{ $tc('blockchain.transaction', 2) }}</div>
      </div>
      <div class="card-body">
        <Transaction v-for="transaction in transactions" :key="transaction.txid"
          :transaction="transaction"></Transaction>
      </div>
    </div>
  </section>
</template>

<script>
  import Block from '@/models/block'
  import Transaction from '@/models/transaction'
  import RequestError from '@/services/qtuminfo-api'

  export default {
    head() {
      return {title: `Block #${this.height} -- qtum.info`}
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
          timestamp: block.timestamp,
          size: block.size,
          weight: block.weight,
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
    }
  }
</script>

<style lang="less" src="@/styles/card.less"></style>
<style lang="less" src="@/styles/info-table.less"></style>
