<template>
  <section class="container">
    <div class="card section-card">
      <div class="card-header">
        <div class="card-header-icon">
          <Icon icon="info" fixed-width></Icon>
        </div>
        <h3 class="card-header-title">{{ $t('contract.summary') }}</h3>
      </div>
      <div class="card-body info-table">
        <div class="columns">
          <div class="column info-title">{{ $t('contract.address') }}</div>
          <AddressLink :address="id" class="column info-value" copyable></AddressLink>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('contract.owner') }}</div>
          <AddressLink :address="owner" class="column info-value" copyable></AddressLink>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('contract.create_transaction') }}</div>
          <TransactionLink :transaction="txid" class="column info-value"></TransactionLink>
        </div>
        <template v-if="token">
          <div class="columns">
            <div class="column info-title">{{ $t('contract.token.name') }}</div>
            <div class="column info-value">{{ token.name }}</div>
          </div>
          <div class="columns">
            <div class="column info-title">{{ $t('contract.token.total_supply') }}</div>
            <div class="column info-value">
              {{ token.totalSupply | token(token.decimals, true) }} {{ token.symbol }}
            </div>
          </div>
        </template>
        <div class="columns">
          <div class="column info-title">{{ $t('contract.balance') }}</div>
          <div class="column info-value">{{ balance | qtum }} QTUM</div>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('contract.total_received') }}</div>
          <div class="column info-value">{{ totalReceived | qtum }} QTUM</div>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('contract.total_sent') }}</div>
          <div class="column info-value">{{ totalSent | qtum }} QTUM</div>
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
        <nav class="pagination" v-if="pages > 1">
          <a class="pagination-previous" @click="previousPage" :disabled="currentPage === 0">
            {{ $t('pagination.previous') }}
          </a>
          <a class="pagination-next" @click="nextPage" :disabled="currentPage >= pages - 1">
            {{ $t('pagination.next') }}
          </a>
        </nav>
        <QtumTransaction v-for="transaction in transactions" :key="transaction.txid"
          :transaction="transaction" :highlight-address="id"></QtumTransaction>
        <nav class="pagination" v-if="pages > 1">
          <a class="pagination-previous" @click="previousPage" :disabled="currentPage === 0">Previous</a>
          <a class="pagination-next" @click="nextPage" :disabled="currentPage >= pages - 1">Next</a>
        </nav>
      </div>
    </div>
  </section>
</template>

<script>
  import Contract from '@/models/contract'
  import Transaction from '@/models/transaction'
  import {RequestError} from '@/services/qtumscan-api'
  import QtumTransaction from '@/components/transaction.vue'

  export default {
    head() {
      return {title: `Contract ${this.id} -- QtumScan`}
    },
    data() {
      return {
        txid: '',
        owner: '',
        token: null,
        balance: '0',
        totalReceived: '0',
        totalSent: '0',
        totalCount: 0,
        transactions: [],
        currentPage: 0
      }
    },
    async asyncData({params, error}) {
      try {
        let contract = await Contract.get(params.id, {from: 0, to: 20})
        contract.transactions = await Promise.all(contract.transactions.map(Transaction.get))
        return {
          txid: contract.txid,
          owner: contract.owner,
          token: contract.token,
          balance: contract.balance,
          totalReceived: contract.totalReceived,
          totalSent: contract.totalSent,
          totalCount: contract.totalCount,
          transactions: contract.transactions
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
      previousPage() {
        this.query(this.currentPage - 1)
      },
      nextPage() {
        this.query(this.currentPage + 1)
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
