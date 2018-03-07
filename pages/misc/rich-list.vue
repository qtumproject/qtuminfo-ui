<template>
  <section class="container" ref="section">
    <Pagination v-if="pages > 1" :pages="pages" :currentPage="currentPage" :getLink="getLink" />
    <table class="table is-fullwidth is-bordered is-striped">
      <thead>
        <tr>
          <th>{{ $t('misc.rank') }}</th>
          <th>{{ $t('misc.address') }}</th>
          <th>{{ $t('misc.balance') }}</th>
          <th>{{ $t('misc.percentage') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="({address, balance}, index) of list">
          <td>{{ 100 * (currentPage - 1) + index + 1 }}</td>
          <td>
            <AddressLink :address="address" />
          </td>
          <td class="monospace break-word">{{ balance | qtum(8) }} QTUM</td>
          <td class="monospace">{{ (balance / totalSupply * 100).toFixed(4) + '%' }}</td>
        </tr>
      </tbody>
    </table>
    <Pagination v-if="pages > 1" :pages="pages" :currentPage="currentPage" :getLink="getLink" />
  </section>
</template>

<script>
  import Misc from '@/models/misc'
  import {RequestError} from '@/services/qtuminfo-api'
  import {scrollIntoView} from '@/utils/dom'

  export default {
    head() {
      return {
        title: this.$t('misc.rich_list_title')
      }
    },
    data() {
      return {
        totalCount: 0,
        list: [],
        currentPage: Number(this.$route.query.page || 1)
      }
    },
    async asyncData({query, redirect, error}) {
      try {
        if (query.page && !/^[1-9]\d*$/.test(query.page)) {
          redirect('/misc/rich-list')
        }
        let page = Number(query.page || 1)
        let {totalCount, list} = await Misc.richList({from: (page - 1) * 100, to: page * 100})
        if (page > 1 && totalCount <= (page - 1) * 100) {
          redirect('/misc/rich-list', {page: Math.ceil(totalCount / 100)})
        }
        return {totalCount, list}
      } catch (err) {
        if (err instanceof RequestError) {
          error({statusCode: err.code, message: err.message})
        } else {
          throw err
        }
      }
    },
    computed: {
      blockchain() {
        return this.$store.state.blockchain
      },
      totalSupply() {
        let height = this.blockchain.height
        if (height <= 5000) {
          return height * 20000
        }
        let supply = 1e16
        let reward = 4e8
        let interval = 985500
        height -= 5000
        let halvings = 0
        while (halvings < 7 && height > interval) {
          supply += interval * (reward >>> halvings++)
          height -= interval
        }
        return supply + height * (reward >>> halvings)
      },
      pages() {
        return Math.ceil(this.totalCount / 100)
      }
    },
    methods: {
      getLink(page) {
        return {name: 'misc-rich-list', query: {page}}
      }
    },
    async beforeRouteUpdate(to, from, next) {
      let page = Number(to.query.page || 1)
      let {totalCount, list} = await Misc.richList({from: (page - 1) * 100, to: page * 100})
      this.totalCount = totalCount
      if (page > this.pages && this.pages > 1) {
        this.$router.push({name: 'misc-rich-list', query: {page: Math.ceil(totalCount / 100)}})
        return
      }
      this.list = list
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
