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
        <Transaction :transaction="transaction" detailed @transaction-change="refresh" />
      </div>
    </div>
  </form>
</template>

<script>
  import Transaction from '@/models/transaction'
  import {RequestError} from '@/services/qtuminfo-api'

  export default {
    head() {
      return {
        title: 'Send Raw Transaction'
      }
    },
    data() {
      return {
        data: '',
        transaction: null
      }
    },
    watch: {
      data() {
        if (this.data.length === 0) {
          this.id = null
          this.fetched = null
        }
      }
    },
    methods: {
      async submit() {
        if (/^([0-9a-f][0-9a-f])+$/i.test(this.data)) {
          try {
            let result = await Transaction.sendRawTransaction(this.data)
            if (result.status) {
              if (result.id) {
                alert('Transaction ' + result.id + ' still processing')
              } else {
                alert(result.message)
              }
            } else {
              this.transaction = result
            }
          } catch (err) {
            if (!err instanceof RequestError) {
              throw err
            }
          }
        } else {
          alert('TX decode failed')
        }
      }
    }
  }
</script>

<style scoped>
  
</style>
