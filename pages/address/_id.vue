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
          <div class="column info-title">Address Hash</div>
          <div class="column info-value">{{ id }}</div>
        </div>
        <div class="columns">
          <div class="column info-title">Balance</div>
          <div class="column info-value">
            {{ balance | qtum }} QTUM
            <template v-if="unconfirmedBalance !== '0'">
              ({{ unconfirmedBalance | qtum }} QTUM unconfirmed)
            </template>
          </div>
        </div>
        <div class="columns">
          <div class="column info-title">Total Received</div>
          <div class="column info-value">{{ totalReceived | qtum }} QTUM</div>
        </div>
        <div class="columns">
          <div class="column info-title">Total Sent</div>
          <div class="column info-value">{{ totalSent | qtum }} QTUM</div>
        </div>
        <div class="columns">
          <div class="column info-title">Transaction Count</div>
          <div class="column info-value">{{ totalCount }}</div>
        </div>
      </div>
    </div>

    <div class="card section-card transaction-list" v-if="transactions.length">
      <div class="card-header">
        <div class="card-header-icon">
          <Icon icon="list-alt" fixed-width></Icon>
        </div>
        <div class="card-header-title">Recent Transactions</div>
      </div>
      <div class="card-body">
        <QtumTransaction v-for="transaction in transactions" :key="transaction.txid"
          :transaction="transaction" :highlight="id"></QtumTransaction>
      </div>
    </div>
  </section>
</template>

<script>
  import Address from '@/models/address'
  import Transaction from '@/models/transaction'
  import {RequestError} from '@/services/qtumscan-api'
  import QtumTransaction from '@/components/transaction.vue'

  export default {
    head() {
      return {title: `Address ${this.id} -- QtumScan`}
    },
    data() {
      return {
        balance: '0',
        totalReceived: '0',
        totalSent: '0',
        unconfirmedBalance: '0',
        txAppearances: 0,
        unconfirmedTxAppearances: 0,
        totalCount: 0,
        transactions: []
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
      }
    },
    components: {QtumTransaction}
  }
</script>

<style lang="less" src="@/styles/card.less"></style>
<style lang="less" src="@/styles/info-table.less"></style>
