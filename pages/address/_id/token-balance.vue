<template>
  <div>
    <form class="select-token" @submit.prevent>
      <label class="radio">
        <input type="radio" value="" v-model="selectedToken"> All
      </label>
      <label v-for="token in tokens" class="radio">
        <input type="radio" :value="token.address" v-model="selectedToken">
        {{ token.name }} ({{ token.symbol }})
      </label>
    </form>
    <div ref="list">
      <Pagination v-if="pages > 1" :pages="pages" :currentPage="currentPage" :getLink="getLink" />
      <table class="table is-fullwidth is-bordered is-striped">
        <thead>
          <tr v-if="responsive.isTablet">
            <th>{{ $t('address.timestamp') }}</th>
            <th>{{ $t('address.transaction_id') }}</th>
            <th>{{ $t('address.token_balances') }}</th>
            <th>{{ $t('address.changes') }}</th>
          </tr>
          <template v-else>
            <tr>
              <th>{{ $t('address.timestamp') }}</th>
              <th>{{ $t('address.transaction_id') }}</th>
            </tr>
            <tr>
              <th>{{ $t('address.token_balances') }}</th>
              <th>{{ $t('address.changes') }}</th>
            </tr>
          </template>
        </thead>
        <tbody>
          <template v-for="{id, timestamp, tokens} in transactions">
            <tr v-if="responsive.isTablet">
              <td>{{ timestamp | timestamp }}</td>
              <td>
                <TransactionLink :transaction="id" />
              </td>
              <td class="monospace">
                <div v-for="{address, name, symbol, decimals, balance} in tokens">
                  {{ balance.replace('-', '') | qrc20(decimals) }}
                  <AddressLink :address="address">
                    {{ symbol || name || $t('contract.token.tokens') }}
                  </AddressLink>
                </div>
              </td>
              <td class="monospace">
                <div v-for="{address, name, symbol, decimals, amount} in tokens">
                  <span v-if="amount > 0">+</span>
                  <span v-else-if="amount < 0">-</span>
                  <span v-else>&nbsp;</span>
                  {{ amount.replace('-', '') | qrc20(decimals) }}
                  <AddressLink :address="address">
                    {{ symbol || name || $t('contract.token.tokens') }}
                  </AddressLink>
                </div>
              </td>
            </tr>
            <template v-else>
              <tr>
                <td>{{ timestamp | timestamp }}</td>
                <td>
                  <TransactionLink :transaction="id" />
                </td>
              </tr>
              <tr>
                <td class="monospace">
                  <div v-for="{address, name, symbol, decimals, balance} in tokens">
                    {{ balance.replace('-', '') | qrc20(decimals) }}
                    <AddressLink :address="address">
                      {{ symbol || name || $t('contract.token.tokens') }}
                    </AddressLink>
                  </div>
                </td>
                <td class="monospace">
                  <div v-for="{address, name, symbol, decimals, amount} in tokens">
                    <span v-if="amount > 0">+</span>
                    <span v-else-if="amount < 0">-</span>
                    <span v-else>&nbsp;</span>
                    {{ amount.replace('-', '') | qrc20(decimals) }}
                    <AddressLink :address="address">
                      {{ symbol || name || $t('contract.token.tokens') }}
                    </AddressLink>
                  </div>
                </td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>
      <Pagination v-if="pages > 1" :pages="pages" :currentPage="currentPage" :getLink="getLink" />
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {Responsive} from '@/plugins/mixins'
  import Address from '@/models/address'
  import {RequestError} from '@/services/qtuminfo-api'
  import {scrollIntoView} from '@/utils/dom'

  export default {
    mixins: [Responsive],
    data() {
      return {
        totalCount: 0,
        transactions: [],
        currentPage: Number(this.$route.query.page || 1),
        selectedToken: ''
      }
    },
    props: {
      tokens: {type: Array, required: true}
    },
    async asyncData({req, params, query, redirect, error}) {
      try {
        if (query.page && !/^[1-9]\d*$/.test(query.page)) {
          redirect(`/address/${params.id}/token-balance`)
        }
        let page = Number(query.page || 1)
        let {totalCount, transactions} = await Address.getTokenBalanceTransactions(
          params.id,
          {page: page - 1, pageSize: 100, tokens: query.tokens},
          {ip: req && req.ip}
        )
        if (page > 1 && totalCount <= (page - 1) * 100) {
          redirect(`/address/${params.id}/token-balance`, {page: Math.ceil(totalCount / 100)})
        }
        return {totalCount, transactions, ...(query.token ? {selectedtoken: query.token.split(',')} : {})}
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
      pages() {
        return Math.ceil(this.totalCount / 100)
      }
    },
    methods: {
      getLink(page) {
        return {
          name: 'address-id-token-balance',
          params: {id: this.id},
          query: {
            page,
            ...this.selectedToken ? {token: this.selectedToken} : {}
          }
        }
      }
    },
    watch: {
      selectedToken(value, oldValue) {
        this.$router.push({
          name: 'address-id-token-balance',
          params: {id: this.id},
          ...(this.selectedToken ? {query: {token: this.selectedToken}} : {})
        })
      }
    },
    async beforeRouteUpdate(to, from, next) {
      let page = Number(to.query.page || 1)
      let token = to.query.token
      let {totalCount, transactions} = await Address.getTokenBalanceTransactions(
        this.id,
        {page: page - 1, pageIndex: 100, token}
      )
      this.totalCount = totalCount
      if (page > this.pages && this.pages > 1) {
        this.$router.push({
          name: 'address-id-token-balance',
          params: {id: this.id},
          query: {page: Math.ceil(totalCount / 100), ...(token ? {token} : {})}
        })
        return
      }
      this.transactions = transactions
      this.currentPage = page
      if (!token) {
        this.selectedToken = ''
      }
      next()
      scrollIntoView(this.$refs.list)
    },
    scrollToTop: true
  }
</script>

<style lang="less" scoped>
  .select-token {
    display: flex;
    flex-flow: wrap;
    margin-bottom: 1em;
    .radio {
      margin-right: 1em;
    }
  }
  .pagination {
    padding: 1em;
  }
</style>
