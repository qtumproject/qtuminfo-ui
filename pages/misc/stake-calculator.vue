<template>
  <form @submit.prevent>
    <div class="field">
      <label>{{ $t('misc.stake_calculator.network_weight') }}</label>
      <div class="control">
        <output class="monospace">{{ netStakeWeight | qtum(8) }}</output>
      </div>
    </div>
    <div class="field">
      <label>{{ $t('misc.stake_calculator.enter_address') }}</label>
      <div class="control">
        <input type="text" class="input monospace" v-model="address">
      </div>
    </div>
    <div class="field">
      <label>{{ $t('misc.stake_calculator.weight') }}</label>
      <div class="control">
        <input type="number" class="input monospace" v-model="weightInput" placeholder="0">
      </div>
    </div>
    <template v-if="weight">
      <div class="field">
        <label>{{ $t('misc.stake_calculator.expected_time') }}</label>
        <div class="control">
          <output>{{ duration }}</output>
        </div>
      </div>
      <div v-if="expectedTime < 100000" class="field">
        <label>{{ $t('misc.stake_calculator.average_blocks_per_day' )}}</label>
        <div class="control">
          <output>{{ (86400 / expectedTime).toFixed(2) }}</output>
        </div>
      </div>
      <div class="field">
        <label>{{ $t('misc.stake_calculator.average_blocks_per_year' )}}</label>
        <div class="control">
          <output>{{ (365 * 86400 / expectedTime).toFixed(2) }}</output>
        </div>
      </div>
    </template>
  </form>
</template>

<script>
  import {toHexAddress} from '@/utils/address'
  import Address from '@/models/address'
  import Misc from '@/models/misc'
  import {RequestError} from '@/services/qtuminfo-api'

  export default {
    head() {
      return {
        title: this.$t('misc.stake_calculator.title')
      }
    },
    data() {
      return {
        netStakeWeight: 0,
        address: '',
        weightInput: '',
      }
    },
    async asyncData({req, error}) {
      try {
        let {netStakeWeight} = await Misc.info({ip: req && req.ip})
        return {netStakeWeight}
      } catch (err) {
        if (err instanceof RequestError) {
          error({statusCode: err.code, message: err.message})
        } else {
          error({statusCode: 500, message: err.message})
        }
      }
    },
    computed: {
      weight() {
        return Math.round(Number(this.weightInput.replace(',')) * 1e8) || 0
      },
      expectedTime() {
        return 144 * this.netStakeWeight / this.weight
      },
      duration() {
        if (this.expectedTime < 60) {
          return this.expectedTime.toFixed(2) + ' ' + this.$t('misc.stake_calculator.seconds')
        } else if (this.expectedTime < 60 * 60) {
          return (this.expectedTime / 60).toFixed(2) + ' ' + this.$t('misc.stake_calculator.minutes')
        } else if (this.expectedTime < 60 * 60 * 24) {
          return (this.expectedTime / 60 / 60).toFixed(2) + ' ' + this.$t('misc.stake_calculator.hours')
        } else if (this.expectedTime < 60 * 60 * 24 * 30) {
          return (this.expectedTime / 60 / 60 / 34).toFixed(2) + ' ' + this.$t('misc.stake_calculator.days')
        } else if (this.expectedTime < 60 * 60 * 24 * 360) {
          return (this.expectedTime / 60 / 60 / 24 / 30).toFixed(2) + ' ' + this.$t('misc.stake_calculator.months')
        } else {
          return (this.expectedTime / 60 / 60 / 24 / 365).toFixed(2) + ' ' + this.$t('misc.stake_calculator.years')
        }
      }
    },
    watch: {
      async address() {
        let addresses = this.address.split(',')
        try {
          if (addresses.every(toHexAddress)) {
            let {mature} = await Address.get(this.address)
            this.weightInput = (mature / 1e8).toFixed(8)
          } else {
            this.weightInput = ''
          }
        } catch (err) {
          if (!(err instanceof RequestError)) {
            throw err
          }
        }
      }
    },
    mounted() {
      this.$interval = setInterval(async () => {
        try {
          let {netStakeWeight} = await Misc.info({ip: req && req.ip})
          this.netStakeWeight = netStakeWeight
        } catch (err) {
          if (!(err instanceof RequestError)) {
            throw err
          }
        }
      }, 10 * 60 * 1000)
    },
    beforeDestroy() {
      clearInterval(this.$interval)
    }
  }
</script>
