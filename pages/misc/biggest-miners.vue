<template>
  <section class="container" ref="section">
    <Pagination v-if="pages > 1" :pages="pages" :currentPage="currentPage" :getLink="getLink" />
    <table class="table is-fullwidth is-bordered is-striped">
      <thead>
        <tr>
          <th>{{ $t('misc.ranking') }}</th>
          <th>{{ $t('misc.address') }}</th>
          <th>{{ $t('misc.blocks_mined') }}</th>
          <th>{{ $t('misc.percentage') }}</th>
          <th>{{ $t('misc.balance') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="({address, blocks, balance}, index) of list">
          <td>{{ 100 * (currentPage - 1) + index + 1 }}</td>
          <td>
            <AddressLink :address="address" />
          </td>
          <td>{{ blocks }}</td>
          <td class="monospace">{{ (blocks / posBlocks * 100).toFixed(4) + '%' }}</td>
          <td class="monospace">{{ balance | qtum(8) }}</td>
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
        title: this.$t('misc.biggest_miners_title')
      }
    },
    data() {
      return {
        totalCount: 0,
        list: [],
        currentPage: Number(this.$route.query.page || 1)
      }
    },
    async asyncData({req, query, redirect, error}) {
      try {
        if (query.page && !/^[1-9]\d*$/.test(query.page)) {
          redirect('/misc/biggest-miners')
        }
        let page = Number(query.page || 1)
        let {totalCount, list} = await Misc.biggestMiners(
          {from: (page - 1) * 100, to: page * 100},
          {ip: req && req.ip}
        )
        if (page > 1 && totalCount <= (page - 1) * 100) {
          redirect('/misc/biggest-miners', {page: Math.ceil(totalCount / 100)})
        }
        return {totalCount, list}
      } catch (err) {
        if (err instanceof RequestError) {
          error({statusCode: err.code, message: err.message})
        } else {
          error({statusCode: 500, message: err.message})
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
      getLink(page) {
        return {name: 'misc-biggest-miners', query: {page}}
      }
    },
    async beforeRouteUpdate(to, from, next) {
      let page = Number(to.query.page || 1)
      let {totalCount, list} = await Misc.biggestMiners({from: (page - 1) * 100, to: page * 100})
      this.totalCount = totalCount
      if (page > this.pages && this.pages > 1) {
        this.$router.push({name: 'misc-biggest-miners', query: {page: Math.ceil(totalCount / 100)}})
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
