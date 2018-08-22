<template>
  <div ref="transaction-list">
    <Pagination v-if="pages > 1" :pages="pages" :currentPage="currentPage" :getLink="getLink" />
    <div class="card section-card transaction-list" v-if="transactions.length">
      <div class="card-body">
        <Transaction v-for="transaction in transactions" :key="transaction.id"
          :transaction="transaction" :highlightAddress="addresses"
          @transaction-change="tx => transactionChange(transaction, tx)" />
      </div>
    </div>
    <Pagination v-if="pages > 1" :pages="pages" :currentPage="currentPage" :getLink="getLink" />
  </div>
</template>

<script>
  import Vue from 'vue'
  import Address from '@/models/address'
  import Transaction from '@/models/transaction'
  import {RequestError} from '@/services/qtuminfo-api'
  import {extendAddress} from '@/utils/address'
  import {scrollIntoView} from '@/utils/dom'

  export default {
    data() {
      return {
        totalCount: 0,
        transactions: [],
        currentPage: Number(this.$route.query.page || 1)
      }
    },
    props: {
      tokens: {type: Array, required: true}
    },
    async asyncData({req, params, query, redirect, error}) {
      try {
        if (query.page && !/^[1-9]\d*$/.test(query.page)) {
          redirect(`/address/${params.id}/`)
        }
        let page = Number(query.page || 1)
        let {totalCount, transactions} = await Address.getTransactions(
          params.id,
          {page: page - 1, pageSize: 20},
          {ip: req && req.ip}
        )
        if (page > 1 && totalCount <= (page - 1) * 20) {
          redirect(`/address/${params.id}/`, {page: Math.ceil(totalCount / 20)})
        }
        transactions = await Transaction.getBrief(transactions, {ip: req && req.ip})
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
        let result = []
        for (let address of this.id.split(',')) {
          if (!result.includes(address)) {
            result.push(address)
          }
        }
        return result
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
        {page: page - 1, pageSize: 20}
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
      this.transactions = await Transaction.getBrief(transactions)
      this.currentPage = page
      next()
      scrollIntoView(this.$refs['transaction-list'])
    },
    scrollToTop: true
  }
</script>
