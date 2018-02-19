<template>
  <section class="container">
    <div class="card section-card">
      <div class="card-header">
        <div class="card-header-icon">
          <Icon icon="code" fixed-width></Icon>
        </div>
        <h3 class="card-header-title">{{ $t('contract.summary') }}</h3>
      </div>
      <div class="card-body info-table">
        <div class="columns">
          <div class="column info-title">{{ $t('contract.address') }}</div>
          <AddressLink :address="id" class="column info-value"></AddressLink>
        </div>
        <div class="columns" v-if="owner">
          <div class="column info-title">{{ $t('contract.owner') }}</div>
          <AddressLink :address="owner" class="column info-value"></AddressLink>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('contract.create_transaction') }}</div>
          <TransactionLink :transaction="txid" class="column info-value"></TransactionLink>
        </div>
        <template v-if="qrc20">
          <div class="columns" v-if="qrc20.name">
            <div class="column info-title">{{ $t('contract.token.name') }}</div>
            <div class="column info-value">{{ qrc20.name }}</div>
          </div>
          <div class="columns">
            <div class="column info-title">{{ $t('contract.token.total_supply') }}</div>
            <div class="column info-value monospace">
              {{ qrc20.totalSupply | qrc20(qrc20.decimals, true) }} {{ qrc20.symbol || 'Tokens' }}
            </div>
          </div>
        </template>
        <div class="columns">
          <div class="column info-title">{{ $t('contract.balance') }}</div>
          <div class="column info-value monospace">{{ balance | qtum }} QTUM</div>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('contract.total_received') }}</div>
          <div class="column info-value monospace">{{ totalReceived | qtum }} QTUM</div>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('contract.total_sent') }}</div>
          <div class="column info-value monospace">{{ totalSent | qtum }} QTUM</div>
        </div>
        <div class="columns" v-if="tokenBalances.length">
          <div class="column info-title">{{ $t('address.token_balances') }}</div>
          <div class="column info-value">
            <div v-for="token in tokenBalances" class="monospace">
              {{ token.balance | qrc20(token.decimals) }}
              <AddressLink :address="token.address":copyable="false">
                {{ token.symbol || 'Tokens' }}
              </AddressLink>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('contract.transaction_count') }}</div>
          <div class="column info-value">{{ totalCount }}</div>
        </div>
      </div>
    </div>

    <div class="card section-card transaction-list" v-if="transactions.length">
      <div class="card-header">
        <div class="card-header-icon">
          <Icon icon="list-alt" fixed-width></Icon>
        </div>
        <div class="card-header-title">{{ $t('contract.transaction_list') }}</div>
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
  import Contract from '@/models/contract'
  import Transaction from '@/models/transaction'
  import {RequestError} from '@/services/qtuminfo-api'

  export default {
    head() {
      return {title: `Contract ${this.id} -- qtum.info`}
    },
    data() {
      return {
        txid: '',
        owner: '',
        type: '',
        qrc20: null,
        balance: '0',
        totalReceived: '0',
        totalSent: '0',
        tokenBalances: [],
        totalCount: 0,
        transactions: [],
        currentPage: 0
      }
    },
    async asyncData({params, error}) {
      try {
        let contract = await Contract.get(params.id)
        let {totalCount, transactions} = await Contract.getTransactions(
          params.id,
          {from: 0, to: 20}
        )
        transactions = await Promise.all(transactions.map(Transaction.get))
        return {
          txid: contract.txid,
          owner: contract.owner,
          type: contract.type,
          qrc20: contract.qrc20,
          balance: contract.balance,
          totalReceived: contract.totalReceived,
          totalSent: contract.totalSent,
          tokenBalances: contract.tokenBalances,
          totalCount,
          transactions
        }
      } catch (err) {
        if (err instanceof RequestError) {
          if (err.code === 404) {
            error({statusCode: 404, message: `Contract ${param.id} not found`})
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
        let {totalCount, transactions} = await Contract.getTransactions(
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
