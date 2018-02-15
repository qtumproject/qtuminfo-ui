<template>
  <section class="container">
    <div class="card section-card">
      <div class="card-header">
        <div class="card-header-icon">
          <Icon icon="info" fixed-width></Icon>
        </div>
        <div class="card-header-title">Rich List</div>
      </div>
      <div class="card-body">
        <table class="table is-fullwidth is-striped">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Address</th>
              <th>Balance</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="({address, balance}, index) of list">
              <td>{{ index + 1 }}</td>
              <td>
                <AddressLink :address="address" copyable></AddressLink>
              </td>
              <td class="monospace">{{ balance | qtum(8) }} QTUM</td>
              <td class="monospace">{{ (balance / totalSupply * 100).toFixed(4) + '%' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script>
  import Misc from '@/models/misc'
  import {RequestError} from '@/services/qtuminfo-api'

  export default {
    head() {
      return {title: `Rich List -- qtum.info`}
    },
    data() {
      return {
        list: []
      }
    },
    async asyncData({error}) {
      try {
        let list = await Misc.richList()
        return {list}
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
        return (this.blockchain.height * 4 + 1e8) * 1e8
      }
    }
  }
</script>

<style lang="less" src="@/styles/card.less"></style>
<style scoped>
  .card-body {
    overflow-x: auto;
  }
</style>
