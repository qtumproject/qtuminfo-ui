<template>
  <section class="container">
    <div class="card address-summary">
      <div class="card-header">
        <div class="card-header-icon">
          <span class="fa fa-fw fa-info"></span>
        </div>
        <h3 class="card-header-title">{{ $t('address.summary') }}</h3>
      </div>
      <div class="card-body">
        <div class="columns">
          <div class="column is-one-quarter has-text-right">Address Hash</div>
          <div class="column">{{ id }}</div>
        </div>
        <div class="columns">
          <div class="column is-one-quarter has-text-right">Balance</div>
          <div class="column">
            {{ balance | qtum }} QTUM
            <template v-if="unconfirmedBalance !== '0'">
              ({{ unconfirmedBalance | qtum }} QTUM unconfirmed)
            </template>
          </div>
        </div>
        <div class="columns">
          <div class="column is-one-quarter has-text-right">Total Received</div>
          <div class="column">{{ totalReceived | qtum }} QTUM</div>
        </div>
        <div class="columns">
          <div class="column is-one-quarter has-text-right">Total Sent</div>
          <div class="column">{{ totalSent | qtum }} QTUM</div>
        </div>
        <div class="columns">
          <div class="column is-one-quarter has-text-right">Transaction Count</div>
          <div class="column">{{ totalCount }}</div>
        </div>
      </div>
    </div>

    <div class="card transaction-list" v-if="transactions.length">
      <div class="card-header">
        <div class="card-header-icon">
          <span class="fa fa-list-alt"></span>
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
        error({statusCode: 404, message: `Address ${params.id} not found`})
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

<style lang="less" scoped>
  .card {
    margin-top: 1em;
    margin-bottom: 1em;
    &:first-child {
      margin-top: 0.5em;
    }
  }

  .address-summary {
    .columns:first-child {
      margin-top: 0.25em;
    }
    .columns:last-child {
      margin-bottom: 0.25em;
    }
    .column {
      padding-top: 0.25em;
      padding-bottom: 0.25em;
    }
    .column:first-child {
      font-weight: bold;
    }
  }

  .transaction-item {
    padding-left: 1.5em;
    padding-right: 1.5em;

    .column:first-child {
      font-weight: normal;
    }

    .toggle-collapse {
      cursor: pointer;
      transition: transform 0.2s;
      &:hover {
        transform: scale(1.2);
      }
    }
    .transaction-input-list, .transaction-output-list {
      margin: 1em;
    }
    .transaction-output-item.detail {
      margin-top: 0.5em;
      margin-bottom: 0.5em;
      &:nth-child(even) {
        background-color: #f8f8f8;
      }
    }
    .amount {
      font-family: Monospace;
    }

    .output-script {
      font-size: 0.8em;
      .key {
        display: inline-block;
        margin-left: 2em;
        margin-right: 1em;
        font-weight: bold;
      }
    }
  }
</style>
