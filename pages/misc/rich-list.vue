<template>
  <section class="container">
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
          <td>{{ index + 1 }}</td>
          <td>
            <AddressLink :address="address" copyable></AddressLink>
          </td>
          <td class="monospace break-word">{{ balance | qtum(8) }} QTUM</td>
          <td class="monospace">{{ (balance / totalSupply * 100).toFixed(4) + '%' }}</td>
        </tr>
      </tbody>
    </table>
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
        let supply = 1e16
        let reward = 4e8
        let height = this.blockchain.height
        let interval = 985500
        while (height >= interval && reward) {
          supply += reward * interval
          height -= interval
          reward >>>= 1
        }
        return supply + height * reward
      }
    }
  }
</script>

<style lang="less" src="@/styles/card.less"></style>
