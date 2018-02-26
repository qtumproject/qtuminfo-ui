<template>
  <section class="container">
    <div class="card section-card">
      <div class="card-header">
        <div class="card-header-icon">
          <Icon icon="address-card-o" fixed-width></Icon>
        </div>
        <h3 class="card-header-title">{{ $t('address.summary') }}</h3>
      </div>
      <div class="card-body info-table">
        <div class="columns">
          <div class="column info-title">{{ $t('address.address') }}</div>
          <AddressLink :address="id" class="column info-value"></AddressLink>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('address.balance') }}</div>
          <div class="column info-value monospace">
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
          <div class="column info-value monospace">{{ totalReceived | qtum }} QTUM</div>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('address.total_sent') }}</div>
          <div class="column info-value monospace">{{ totalSent | qtum }} QTUM</div>
        </div>
        <div class="columns" v-if="tokenBalances.length">
          <div class="column info-title">{{ $t('address.token_balances') }}</div>
          <div class="column info-value">
            <div v-for="token in tokenBalances" class="monospace">
              {{ token.balance | qrc20(token.decimals) }}
              <AddressLink :address="token.address" :copyable="false">
                {{ token.symbol || $t('contract.token.tokens') }}
              </AddressLink>
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
        <Pagination v-if="pages > 1" :pages="pages" :current-page="currentPage"
          @page="jumpToPage"></Pagination>
        <Transaction v-for="transaction in transactions" :key="transaction.txid"
          :transaction="transaction" :highlight-address="id"
          @transaction-change="tx => transactionChange(transaction, tx)"
          ></Transaction>
        <Pagination v-if="pages > 1" :pages="pages" :current-page="currentPage"
          @page="page => jumpToPage(page, true)"></Pagination>
      </div>
    </div>
  </section>
</template>

<script>
  import Vue from 'vue'
  import Address from '@/models/address'
  import Transaction from '@/models/transaction'
  import {RequestError} from '@/services/qtuminfo-api'

  export default {
    head() {
      return {title: `Address ${this.id} - qtum.info`}
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
        let address = await Address.get(params.id)
        let {totalCount, transactions} = await Address.getTransactions(
          params.id,
          {from: 0, to: 20}
        )
        transactions = await Promise.all(transactions.map(Transaction.get))
        return {
          balance: address.balance,
          totalReceived: address.totalReceived,
          totalSent: address.totalSent,
          unconfirmedBalance: address.unconfirmedBalance,
          stakingBalance: address.stakingBalance,
          tokenBalances: address.tokenBalances,
          totalCount,
          transactions
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
        if (page >= this.pages && this.pages > 0) {
          return await this.query(this.pages - 1)
        }
        this.transactions = await Promise.all(transactions.map(Transaction.get))
        this.currentPage = page
      },
      async jumpToPage(page, scroll) {
        await this.query(page)
        if (scroll) {
          this.$refs['transaction-list'].scrollIntoView()
        }
      },
      transactionChange(oldTransaction, newTransaction) {
        Vue.set(oldTransaction, 'blockHeight', newTransaction.block.height)
        Vue.set(oldTransaction, 'blockHash', newTransaction.block.hash)
        oldTransaction.tokenTransfers = newTransaction.tokenTransfers
      }
    }
  }
</script>

<style lang="less" scoped>
  .pagination {
    padding: 1em;
  }
</style>
