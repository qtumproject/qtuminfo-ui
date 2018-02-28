<template>
  <section class="container" ref="section">
    <Pagination :pages="pages" :current-page="currentPage" @page="jumpToPage"></Pagination>
    <table class="table is-fullwidth is-bordered is-striped">
      <thead>
        <tr>
          <th>{{ $t('misc.rank') }}</th>
          <th>{{ $t('misc.address') }}</th>
          <th>{{ $t('misc.blocks_mined') }}</th>
          <th>{{ $t('misc.percentage') }}</th>
          <th>{{ $t('misc.balance') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="({address, blocks, balance}, index) of list">
          <td>{{ 100 * currentPage + index + 1 }}</td>
          <td>
            <AddressLink :address="address"></AddressLink>
          </td>
          <td>{{ blocks }}</td>
          <td class="monospace">{{ (blocks / posBlocks * 100).toFixed(4) + '%' }}</td>
          <td class="monospace">{{ balance | qtum(8) }}</td>
        </tr>
      </tbody>
    </table>
    <Pagination :pages="pages" :current-page="currentPage" @page="jumpToPage"></Pagination>
  </section>
</template>

<script>
  import Misc from '@/models/misc'
  import {RequestError} from '@/services/qtuminfo-api'
  import {scrollIntoView} from '@/utils/dom'

  export default {
    head() {
      return {
        title: this.$t('misc.biggest_miners_title')
      }
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
        return await Misc.biggestMiners({from: 0, to: 100})
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
      posBlocks() {
        return this.blockchain.height - 5000
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
        let {totalCount, list} = await Misc.biggestMiners({from: page * 100, to: (page + 1) * 100})
        this.totalCount = totalCount
        if (page >= this.pages && this.pages > 0) {
          return await this.query(this.pages - 1)
        }
        this.list = list
        this.currentPage = page
      },
      async jumpToPage(page) {
        await this.query(page)
        scrollIntoView(this.$refs.section)
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
