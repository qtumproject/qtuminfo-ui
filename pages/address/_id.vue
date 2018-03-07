<template>
  <section class="container">
    <div class="card section-card">
      <div class="card-header">
        <div class="card-header-icon">
          <Icon icon="address-card-o" fixedWidth />
        </div>
        <h3 class="card-header-title">{{ $t('address.summary') }}</h3>
      </div>
      <div class="card-body info-table">
        <div class="columns">
          <div class="column info-title">{{ $t('address.address') }}</div>
          <div class="column info-value">
            <div v-for="address in id.split(',')">
              <AddressLink :address="address" plain />
            </div>
          </div>
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
              <AddressLink :address="token.address">
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

    <div class="card section-card transaction-list" ref="transaction-list">
      <div class="card-header">
        <div class="card-header-icon">
          <Icon icon="list-alt" fixedWidth />
        </div>
        <div class="card-header-title">{{ $t('address.transaction_list') }}</div>
      </div>
      <div class="card-body">
        <Pagination v-if="pages > 1" :pages="pages" :currentPage="currentPage" :getLink="getLink" />
        <Transaction v-for="transaction in transactions" :key="transaction.txid"
          :transaction="transaction" :highlightAddress="hexAddress"
          @transaction-change="tx => transactionChange(transaction, tx)" />
        <Pagination v-if="pages > 1" :pages="pages" :currentPage="currentPage" :getLink="getLink" />
      </div>
    </div>
  </section>
</template>

<script>
  import Vue from 'vue'
  import Address from '@/models/address'
  import Transaction from '@/models/transaction'
  import {RequestError} from '@/services/qtuminfo-api'
  import {toHexAddress} from '@/utils/address'
  import {scrollIntoView} from '@/utils/dom'

  export default {
    head() {
      return {
        title: this.$t('blockchain.address') + ' ' + this.id
      }
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
        currentPage: Number(this.$route.query.page || 1)
      }
    },
    async asyncData({params, query, redirect, error}) {
      try {
        let address = await Address.get(params.id)
        if (query.page && !/^[1-9]\d*$/.test(query.page)) {
          redirect(`/address/${params.id}`)
        }
        let page = Number(query.page || 1)
        let {totalCount, transactions} = await Address.getTransactions(
          params.id,
          {from: (page - 1) * 20, to: page * 20}
        )
        if (page > 1 && totalCount <= (page - 1) * 20) {
          redirect(`/address/${params.id}`, {page: Math.ceil(totalCount / 20)})
        }
        transactions = await Transaction.get(transactions)
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
      hexAddress() {
        return toHexAddress(this.id)
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
    }
  }
</script>

<style lang="less" scoped>
  .pagination {
    padding: 1em;
  }
</style>
