<template>
  <section class="container">
    <div class="card section-card">
      <div class="card-header">
        <div class="card-header-icon">
          <Icon icon="info" fixed-width></Icon>
        </div>
        <h3 class="card-header-title">{{ $t('address.summary') }}</h3>
      </div>
      <div class="card-body info-table">
        <div class="columns">
          <div class="column info-title">{{ $t('address.address') }}</div>
          <AddressLink :address="id" class="column info-value" copyable></AddressLink>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('address.balance') }}</div>
          <div class="column info-value">
            {{ balance | qtum }} QTUM
            <span v-if="unconfirmedBalance !== '0' && stakingBalance !== '0'">
              ({{ unconfirmedBalance | qtum }} QTUM {{ $t('address.unconfirmed') }},
              {{ stakingBalance | qtum }} QTUM {{ $t('address.staking') }})
            </span>
            <span v-else-if="unconfirmedBalance !== '0'">
              ({{ unconfirmedBalance | qtum }} QTUM {{ $t('address.unconfirmed') }})
            </span>
            <span v-else-if="stakingBalance !== '0'">
              ({{ stakingBalance | qtum }} QTUM {{ $t('address.staking') }})
            </span>
          </div>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('address.total_received') }}</div>
          <div class="column info-value">{{ totalReceived | qtum }} QTUM</div>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('address.total_sent') }}</div>
          <div class="column info-value">{{ totalSent | qtum }} QTUM</div>
        </div>
        <div class="columns" v-if="tokenBalances.length">
          <div class="column info-title">{{ $t('address.token_balances') }}</div>
          <div class="column info-value">
            <div v-for="token in tokenBalances">
              {{ token.balance | qrc20(token.decimals) }}
              <AddressLink :address="token.address">{{ token.symbol || 'Tokens' }}</AddressLink>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('address.transaction_count') }}</div>
          <div class="column info-value">{{ totalCount }}</div>
        </div>
      </div>
    </div>

    <div class="card section-card transaction-list" v-if="transactions.length" ref="transaction-list">
      <div class="card-header">
        <div class="card-header-icon">
          <Icon icon="list-alt" fixed-width></Icon>
        </div>
        <div class="card-header-title">{{ $t('address.transaction_list') }}</div>
      </div>
      <div class="card-body">
        <nav class="pagination" v-if="pages > 1">
          <a class="pagination-previous" @click="previousPage(false)" :disabled="currentPage === 0">
            {{ $t('pagination.previous') }}
          </a>
          <a class="pagination-next" @click="nextPage(false)" :disabled="currentPage >= pages - 1">
            {{ $t('pagination.next') }}
          </a>
        </nav>
        <QtumTransaction v-for="transaction in transactions" :key="transaction.txid"
          :transaction="transaction" :highlight-address="id"></QtumTransaction>
        <nav class="pagination" v-if="pages > 1">
          <a class="pagination-previous" @click="previousPage(true)" :disabled="currentPage === 0">
            {{ $t('pagination.previous') }}
          </a>
          <a class="pagination-next" @click="nextPage(true)" :disabled="currentPage >= pages - 1">
            {{ $t('pagination.next') }}
          </a>
        </nav>
      </div>
    </div>
  </section>
</template>

<script>
  import Address from '@/models/address'
  import Transaction from '@/models/transaction'
  import {RequestError} from '@/services/qtuminfo-api'
  import QtumTransaction from '@/components/transaction.vue'

  export default {
    head() {
      return {title: `Address ${this.id} -- qtum.info`}
    },
    data() {
      return {
        balance: '0',
        totalReceived: '0',
        totalSent: '0',
        unconfirmedBalance: '0',
        stakingBalance: '0',
        tokenBalances: [],
        totalCount: 0,
        transactions: [],
        currentPage: 0
      }
    },
    async asyncData({params, error}) {
      try {
        let address = await Address.get(params.id, {from: 0, to: 20})
        address.transactions = await Promise.all(address.transactions.map(Transaction.get))
        return {
          balance: address.balance,
          totalReceived: address.totalReceived,
          totalSent: address.totalSent,
          unconfirmedBalance: address.unconfirmedBalance,
          stakingBalance: address.stakingBalance,
          tokenBalances: address.tokenBalances,
          totalCount: address.totalCount,
          transactions: address.transactions
        }
      } catch (err) {
        if (err instanceof RequestError) {
          if (err.code === 404) {
            error({statusCode: 404, message: `Address ${param.id} not found`})
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
      pages() {
        return Math.ceil(this.totalCount / 20)
      }
    },
    methods: {
      async query(page) {
        if (page < 0 || page >= this.pages) {
          return
        }
        let {totalCount, transactions} = await Address.getTransactions(
          this.id,
          {from: page * 20, to: (page + 1) * 20}
        )
        this.totalCount = totalCount
        if (page >= this.pages && pages > 0) {
          return this.query(this.pages - 1)
        }
        this.transactions = await Promise.all(transactions.map(Transaction.get))
        this.currentPage = page
      },
      async previousPage(scroll) {
        await this.query(this.currentPage - 1)
        if (scroll) {
          this.$refs['transaction-list'].scrollIntoView()
        }
      },
      async nextPage(scroll) {
        await this.query(this.currentPage + 1)
        if (scroll) {
          this.$refs['transaction-list'].scrollIntoView()
        }
      }
    },
    components: {QtumTransaction}
  }
</script>

<style lang="less" src="@/styles/card.less"></style>
<style lang="less" src="@/styles/info-table.less"></style>
<style lang="less" scoped>
  .pagination {
    padding: 1em;
  }
</style>
