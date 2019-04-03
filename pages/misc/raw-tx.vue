<template>
  <form @submit.prevent="submit">
    <div class="field">
      <div class="control">
        <textarea class="textarea" v-model="data" placeholder="Raw Transaction Data"></textarea>
      </div>
    </div>
    <div class="field">
      <div class="control">
        <button type="submit" class="button is-link">Submit</button>
      </div>
    </div>
    <div v-if="transaction" class="card section-card">
      <div class="card-body info-table">
        <Transaction :transaction="transaction" />
      </div>
    </div>
    <div v-else-if="id" class="card section-card">
      <div class="card-body info-table">
        <div class="columns is-multiline transaction-item">
          <div class="column is-full is-clearfix">
            <div class="is-pulled-left collapse-bottom">
              <TransactionLink :transaction="id" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
  import Transaction from '@/models/transaction'

  export default {
    head() {
      return {
        title: 'Send Raw Transaction'
      }
    },
    data() {
      return {
        data: '',
        id: null,
        transaction: null
      }
    },
    methods: {
      async submit() {
        if (/^([0-9a-f][0-9a-f])+$/i.test(this.data)) {
          let result = await Transaction.sendRawTransaction(this.data)
          if (result.status) {
            alert(result.message)
          } else {
            this.id = result.id
            this.transaction = null
          }
        } else {
          alert('TX decode failed')
        }
      },
      onMempoolTransaction(transaction) {
        if (transaction.id === this.id) {
          this.transaction = transaction
        }
      }
    },
    mounted() {
      this._onMempoolTransaction = this.onMempoolTransaction.bind(this)
      this.$subscribe('mempool', 'mempool/transaction', this._onMempoolTransaction)
    },
    beforeDestroy() {
      this.$unsubscribe('mempool', 'mempool/transaction', this._onMempoolTransaction)
    }
  }
</script>

<style lang="less" scoped>
  .transaction-item {
    padding-left: 0.75em;
    padding-right: 0.75em;
    &::before {
      display: block;
      width: 100%;
      height: 1px;
      background-color: #ccc;
      content: "";
    }
    &:first-child {
      margin-top: 0;
      &::before {
        display: none;
      }
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
</style>
