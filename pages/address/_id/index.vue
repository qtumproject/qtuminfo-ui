<template>
  <div class="card section-card transaction-list" ref="transaction-list" v-if="transactions.length">
    <div class="card-header">
      <div class="card-header-icon">
        <Icon icon="list-alt" fixedWidth />
      </div>
      <div class="card-header-title">{{ $t('address.transaction_list') }}</div>
    </div>
    <div class="card-body">
      <Pagination v-if="pages > 1" :pages="pages" :currentPage="currentPage" :getLink="getLink" />
      <Transaction v-for="transaction in transactions" :key="transaction.id"
        :transaction="transaction" :highlightAddress="addresses"
        @transaction-change="tx => transactionChange(transaction, tx)" />
      <Pagination v-if="pages > 1" :pages="pages" :currentPage="currentPage" :getLink="getLink" />
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Address from '@/models/address'
  import Transaction from '@/models/transaction'
  import {RequestError} from '@/services/qtuminfo-api'
  import {toHexAddress, extendAddress} from '@/utils/address'
  import {scrollIntoView} from '@/utils/dom'

  export default {
    data() {
      return {
        totalCount: 0,
        transactions: [],
        currentPage: Number(this.$route.query.page || 1)
      }
    },
    async asyncData({params, query, redirect, error}) {
      try {
        if (query.page && !/^[1-9]\d*$/.test(query.page)) {
          redirect(`/address/${params.id}/`)
        }
        let page = Number(query.page || 1)
        let {totalCount, transactions} = await Address.getTransactions(
          params.id,
          {from: (page - 1) * 20, to: page * 20}
        )
        if (page > 1 && totalCount <= (page - 1) * 20) {
          redirect(`/address/${params.id}/`, {page: Math.ceil(totalCount / 20)})
        }
        transactions = await Transaction.get(transactions)
        return {totalCount, transactions}
      } catch (err) {
        if (err instanceof RequestError) {
          error({statusCode: err.code, message: err.message})
        } else {
          error({statusCode: 500, message: err.message})
        }
      }
    },
    computed: {
      id() {
        return this.$route.params.id
      },
      addresses() {
        let list = [].concat(...this.id.split(',').map(extendAddress))
        let result = []
        for (let address of list) {
          if (!result.includes(address)) {
            result.push(address)
          }
        }
        return result
      },
      hexAddress() {
        return this.id.split(',').map(toHexAddress)
      },
      pages() {
        return Math.ceil(this.totalCount / 20)
      }
    },
    methods: {
      getLink(page) {
        return {name: 'address-id', params: {id: this.id}, query: {page}}
      },
      transactionChange(oldTransaction, newTransaction) {
        Vue.set(oldTransaction, 'blockHeight', newTransaction.block.height)
        Vue.set(oldTransaction, 'blockHash', newTransaction.block.hash)
        oldTransaction.tokenTransfers = newTransaction.tokenTransfers
      }
    },
    async beforeRouteUpdate(to, from, next) {
      let page = Number(to.query.page || 1)
      let {totalCount, transactions} = await Address.getTransactions(
        this.id,
        {from: (page - 1) * 20, to: page * 20}
      )
      this.totalCount = totalCount
      if (page > this.pages && this.pages > 1) {
        this.$router.push({
          name: 'address-id',
          params: {id: this.id},
          query: {page: Math.ceil(totalCount / 20)}
        })
        return
      }
      this.transactions = await Transaction.get(transactions)
      this.currentPage = page
      next()
      scrollIntoView(this.$refs['transaction-list'])
    },
    scrollToTop: true
  }
</script>

<style lang="less" scoped>
  .pagination {
    padding: 1em;
  }
</style>
