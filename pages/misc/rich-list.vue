<template>
  <section class="container" ref="section">
    <Pagination :pages="pages" :current-page="currentPage" @page="jumpToPage"></Pagination>
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
          <td>{{ 100 * currentPage + index + 1 }}</td>
          <td>
            <AddressLink :address="address"></AddressLink>
          </td>
          <td class="monospace break-word">{{ balance | qtum(8) }} QTUM</td>
          <td class="monospace">{{ (balance / totalSupply * 100).toFixed(4) + '%' }}</td>
        </tr>
      </tbody>
    </table>
    <Pagination :pages="pages" :current-page="currentPage" @page="page => jumpToPage(page, true)"></Pagination>
  </section>
</template>

<script>
  import Misc from '@/models/misc'
  import {RequestError} from '@/services/qtuminfo-api'

  export default {
    head() {
      return {title: `Rich List - qtum.info`}
    },
    data() {
      return {
        totalCount: 0,
        list: [],
        currentPage: 0
      }
    },
    async asyncData({error}) {
      try {
        return await Misc.richList({from: 0, to: 100})
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
      async query(page) {
        if (page < 0 || page >= this.pages) {
          return
        }
        let {totalCount, list} = await Misc.richList({from: page * 100, to: (page + 1) * 100})
        this.totalCount = totalCount
        if (page >= this.pages && pages > 0) {
          return await this.query(this.pages - 1)
        }
        this.list = list
        this.currentPage = page
      },
      async jumpToPage(page, scroll) {
        await this.query(page)
        this.currentPage = page
        if (scroll) {
          this.$refs.section.scrollIntoView()
        }
      }
    }
  }
</script>

<style scoped>
  .table {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
</style>
