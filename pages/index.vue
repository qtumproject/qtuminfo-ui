<template>
  <div class="container">
    <section class="columns is-multiline is-desktop">
      <div class="column">
        <div class="card">
          <div class="card-header">
            <div class="card-header-icon">
              <Icon icon="tachometer-alt" fixedWidth />
            </div>
            <h3 class="card-header-title">
              {{ $t('misc.network_statistics') }}
            </h3>
          </div>
          <div class="card-body">
            <p class="information">
              <span class="key">{{ $t('blockchain.blockchain_height') }}</span>:
              <span class="value">{{ blockchain.height.toLocaleString() }}</span>
            </p>
            <p class="information">
              <span class="key">{{ $t('blockchain.current_difficulty') }}</span>:
              <span class="value">{{ difficulty.toLocaleString() }}</span>
            </p>
            <p class="information">
              <span class="key">{{ $t('blockchain.network_weight') }}</span>:
              <span class="value">{{ stakeWeight | qtum(8) }}</span>
            </p>
            <p class="information">
              <span class="key">{{ $t('blockchain.fee_rate') }}</span>:
              <span class="value">{{ feeRate }} QTUM/kB</span>
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="columns is-multiline is-desktop">
      <div class="column is-half">
        <div class="card">
          <div class="card-header">
            <div class="card-header-icon">
              <Icon icon="cubes" fixedWidth />
            </div>
            <h3 class="card-header-title">
              {{ $tc('blockchain.block', 2) }}
            </h3>
            <nuxt-link to="/block" class="card-header-button button is-qtum is-outlined">
              {{ $t('action.view_all') }}
            </nuxt-link>
          </div>
          <div class="card-body">
            <div v-for="block in recentBlocks" class="qtum-block is-size-7" :key="block.hash">
              <div class="level">
                <div class="level-left">
                  <nuxt-link :to="{name: 'block-id', params: {id: block.height}}"
                    class="level-item qtum-block-box has-text-centered">
                    {{ $tc('blockchain.block', 1) }} #{{ block.height }}
                    <FromNow :timestamp="block.timestamp" />
                  </nuxt-link>
                  <div class="level-item">
                    <div>
                      <i18n path="block.brief.address">
                        <AddressLink :address="block.miner" />
                      </i18n>
                      <br>
                      {{ $t('block.brief.transaction', [block.transactionCount, block.interval]) }}
                      <br>
                      <span class="monospace">
                        {{ $t('block.brief.reward') }} {{ block.reward | qtum }} QTUM
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="column is-half">
        <div class="card">
          <div class="card-header">
            <div class="card-header-icon">
              <Icon icon="list-alt" fixedWidth />
            </div>
            <h3 class="card-header-title">
              {{ $tc('blockchain.transaction', 2) }}
            </h3>
          </div>
          <div class="card-body">
            <div v-for="transaction in recentTransactions" :key="transaction.id" class="is-size-7 transaction">
              <div class="level">
                <TransactionLink :transaction="transaction.id" class="level-left" />
                <span class="level-right">{{ transaction.outputValue | qtum }} QTUM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import Block from "@/models/block"
  import Transaction from "@/models/transaction"
  import Misc from '@/models/misc'
  import {RequestError} from '@/services/qtuminfo-api'

  export default {
    head() {
      return {
        title: 'qtum.info',
        titleTemplate: null
      }
    },
    data() {
      return {
        recentBlocks: [],
        recentTransactions: [],
        difficulty: 0,
        stakeWeight: 0,
        feeRate: 0
      }
    },
    async asyncData({store, req, error}) {
      try {
        let [currentBlock, recentBlocks, recentTransactions, {netStakeWeight: stakeWeight, feeRate}] = await Promise.all([
          Block.get(store.state.blockchain.height),
          Block.getRecentBlocks({ip: req && req.ip}),
          Transaction.getRecentTransactions({ip: req && req.ip}),
          Misc.info({ip: req && req.ip})
        ])
        return {difficulty: currentBlock.difficulty, recentBlocks, recentTransactions, stakeWeight, feeRate}
      } catch (err) {
        if (err instanceof RequestError) {
          error({statusCode: err.code, message: err.message})
        } else {
          error({statusCode: 500, message: err.message})
        }
      }
    },
    computed: {
      blockchain() {
        return this.$store.state.blockchain
      }
    },
    methods: {
      onMempoolTransaction(transaction) {
        this.recentTransactions.unshift(transaction)
        if (this.recentTransactions.length > 27) {
          this.recentTransactions.pop()
        }
      },
      onStakeWeight(stakeWeight) {
        this.stakeWeight = stakeWeight
      },
      onFeeRate(feeRate) {
        this.feeRate = feeRate
      }
    },
    watch: {
      async 'blockchain.height'(height) {
        let block = await Block.get(height)
        this.difficulty = block.difficulty
        if (height === this.recentBlocks[0].height + 1) {
          this.recentBlocks.unshift({
            hash: block.hash,
            height: block.height,
            timestamp: block.timestamp,
            interval: block.interval,
            size: block.size,
            transactionCount: block.transactions.length,
            miner: block.miner,
            reward: block.reward
          })
          this.recentBlocks.pop()
        } else {
          this.recentBlocks = await Block.getRecentBlocks()
        }
      }
    },
    mounted() {
      this._onMempoolTransaction = this.onMempoolTransaction.bind(this)
      this._onStakeWeight = this.onStakeWeight.bind(this)
      this._onFeeRate = this.onFeeRate.bind(this)
      this.$subscribe('mempool', 'mempool/transaction', this._onMempoolTransaction)
      this.$subscribe('blockchain', 'stakeweight', this._onStakeWeight)
      this.$subscribe('blockchain', 'feerate', this._onFeeRate)
    },
    beforeDestroy() {
      this.$unsubscribe('mempool', 'mempool/transaction', this._onMempoolTransaction)
      this.$unsubscribe('blockchain', 'stakeweight', this._onStakeWeight)
      this.$unsubscribe('blockchain', 'feerate', this._onFeeRate)
    }
  }
</script>

<style lang="less" scoped>
  @import '../styles/variables.less';

  .columns.is-desktop {
    margin: 0;
  }

  .qtum-block {
    padding: 1em;
    border-top: 1px solid #eee;
    &:first-child {
      border-top: none;
    }
  }

  .qtum-block-box {
    flex-direction: column;
    min-width: 11em;
    padding: 1em;
    background-color: #eee;
    color: inherit;
    &:hover {
      outline: 1px solid @qtum;
    }
  }

  .information {
    padding: 0.1em 1em;
    &:first-child {
      padding-top: 0.5em;
    }
    &:last-child {
      padding-bottom: 0.5em;
    }
    .value {
      font-family: monospace
    }
  }

  .transaction {
    padding: 0.5em 1em;
    border-top: 1px solid #eee;
    &:first-child {
      border-top: none;
    }
    font-family: monospace;
    @media (min-width: 769px) {
      .level-left {
        flex-shrink: 1;
        overflow: hidden;
        white-space: nowrap;
        margin-right: 1em;
        a {
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    }
  }
</style>
