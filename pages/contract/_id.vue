<template>
  <section class="container">
    <div class="card section-card">
      <div class="card-header">
        <div class="card-header-icon">
          <Icon icon="code" fixedWidth />
        </div>
        <h3 class="card-header-title">{{ $t('contract.summary') }}</h3>
      </div>
      <div class="card-body info-table">
        <div class="columns">
          <div class="column info-title">{{ $t('contract.address') }}</div>
          <div class="column info-value">
            <AddressLink :address="id" plain />
          </div>
        </div>
        <div class="columns" v-if="owner">
          <div class="column info-title">{{ $t('contract.owner') }}</div>
          <div class="column info-value">
            <AddressLink :address="owner" />
          </div>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('contract.create_transaction') }}</div>
          <div class="column info-value">
            <TransactionLink :transaction="txid" />
          </div>
        </div>
        <template v-if="qrc20">
          <div class="columns" v-if="qrc20.name">
            <div class="column info-title">{{ $t('contract.token.name') }}</div>
            <div class="column info-value">{{ qrc20.name }}</div>
          </div>
          <div class="columns">
            <div class="column info-title">{{ $t('contract.token.total_supply') }}</div>
            <div class="column info-value monospace">
              {{ qrc20.totalSupply | qrc20(qrc20.decimals, true) }}
              {{ qrc20.symbol || $t('contract.token.tokens') }}
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
              <AddressLink :address="token.address">
                {{ token.symbol || $t('contract.token.tokens') }}
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
        <Pagination v-if="pages > 1" :pages="pages" :currentPage="currentPage" :getLink="getLink" />
        <Transaction v-for="transaction in transactions" :key="transaction.txid"
          :transaction="transaction" :highlightAddress="id"
          @transaction-change="tx => transactionChange(transaction, tx)" />
        <Pagination v-if="pages > 1" :pages="pages" :currentPage="currentPage" :getLink="getLink" />
      </div>
    </div>
  </section>
</template>

<script>
  import Vue from 'vue'
  import Contract from '@/models/contract'
  import Transaction from '@/models/transaction'
  import {RequestError} from '@/services/qtuminfo-api'
  import {scrollIntoView} from '@/utils/dom'

  export default {
    head() {
      return {
        title: this.$t('blockchain.contract') + ' ' + this.id
      }
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
        currentPage: Number(this.$route.query.page || 1)
      }
    },
    async asyncData({params, query, redirect, error}) {
      try {
        let contract = await Contract.get(params.id)
        if (query.page && !/^[1-9]\d*$/.test(query.page)) {
          redirect(`/contract/${params.id}`)
        }
        let page = Number(query.page || 1)
        let {totalCount, transactions} = await Contract.getTransactions(
          params.id,
          {from: (page - 1) * 20, to: page * 20}
        )
        if (page > 1 && totalCount <= (page - 1) * 20) {
          redirect(`/address/${params.id}`, {page: Math.ceil(totalCount / 20)})
        }
        transactions = await Transaction.get(transactions)
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
      getLink(page) {
        return {name: 'contract-id', params: {id: this.id}, query: {page}}
      },
      transactionChange(oldTransaction, newTransaction) {
        Vue.set(oldTransaction, 'blockHeight', newTransaction.block.height)
        Vue.set(oldTransaction, 'blockHash', newTransaction.block.hash)
        oldTransaction.tokenTransfers = newTransaction.tokenTransfers
      }
    },
    async beforeRouteUpdate(to, from, next) {
      let page = Number(to.query.page || 1)
      let {totalCount, transactions} = await Contract.getTransactions(
        this.id,
        {from: (page - 1) * 20, to: page * 20}
      )
      this.totalCount = totalCount
      if (page > this.pages && this.pages > 1) {
        this.$router.push({
          name: 'contract-id',
          params: {id: this.id},
          query: {page: Math.ceil(totalCount / 20)}
        })
        return
      }
      this.transactions = await Transactions.get(transactions)
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
