<template>
  <section class="container" ref="section">
    <Pagination v-if="pages > 1" :pages="pages" :currentPage="currentPage" :getLink="getLink" />
    <table class="table is-fullwidth is-bordered is-striped">
      <thead>
        <tr>
          <th>{{ $t('misc.ranking') }}</th>
          <th>{{ $t('contract.token.name') }}</th>
          <th>{{ $t('contract.token.total_supply') }}</th>
          <th>{{ $t('contract.token.token_holders') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="({addressHex, name, symbol, decimals, totalSupply, holders}, index) of tokens">
          <td>{{ 20 * (currentPage - 1) + index + 1 }}</td>
          <td>
            <AddressLink :address="addressHex">{{ name }}</AddressLink>
          </td>
          <td class="monospace break-word">
            {{ totalSupply | qrc20(decimals, true) }}
            {{ symbol || name || $t('contract.token.tokens') }}
          </td>
          <td>{{ holders }}</td>
        </tr>
      </tbody>
    </table>
    <Pagination v-if="pages > 1" :pages="pages" :currentPage="currentPage" :getLink="getLink" />
  </section>
</template>

<script>
  import Contract from '@/models/contract'
  import {RequestError} from '@/services/qtuminfo-api'
  import {scrollIntoView} from '@/utils/dom'

  export default {
    head() {
      return {
        title: this.$t('contract.token.tokens')
      }
    },
    data() {
      return {
        totalCount: 0,
        tokens: [],
        currentPage: Number(this.$route.query.page || 1)
      }
    },
    async asyncData({req, query, redirect, error}) {
      try {
        if (query.page && !/^[1-9]\d*$/.test(query.page)) {
          redirect('/contract/tokens')
        }
        let page = Number(query.page || 1)
        let {totalCount, tokens} = await Contract.listTokens(
          {page: page - 1, pageSize: 20},
          {ip: req && req.ip}
        )
        if (page > 1 && totalCount <= (page - 1) * 20) {
          redirect('/contract/tokens', {page: Math.ceil(totalCount / 20)})
        }
        return {totalCount, tokens}
      } catch (err) {
        if (err instanceof RequestError) {
          error({statusCode: err.code, message: err.message})
        } else {
          error({statusCode: 500, message: err.message})
        }
      }
    },
    computed: {
      pages() {
        return Math.ceil(this.totalCount / 20)
      }
    },
    methods: {
      getLink(page) {
        return {name: 'contract-tokens', query: {page}}
      }
    },
    async beforeRouteUpdate(to, from, next) {
      let page = Number(to.query.page || 1)
      let {totalCount, tokens} = await Contract.listTokens({page: page - 1, pageSize: 20})
      this.totalCount = totalCount
      if (page > this.pages && this.pages > 1) {
        this.$router.push({name: 'contract-tokens', query: {page: Math.ceil(totalCount / 20)}})
        return
      }
      this.tokens = tokens
      this.currentPage = page
      next()
      scrollIntoView(this.$refs.section)
    }
  }
</script>

<style scoped>
  .table {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
</style>
