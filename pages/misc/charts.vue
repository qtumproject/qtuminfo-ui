<template>
  <section class="container">
    <div class="chart-wrapper">
      <div class="chart" ref="daily-transactions"></div>
    </div>
    <div class="chart-wrapper">
      <div class="chart" ref="block-interval"></div>
    </div>
    <div class="chart-wrapper">
      <div class="chart" ref="address-growth"></div>
    </div>
  </section>
</template>

<script>
  import Misc from '@/models/misc'
  import {RequestError} from '@/services/qtuminfo-api'

  export default {
    head() {
      return {
        title: this.$t('misc.charts_title')
      }
    },
    data() {
      return {
        dailyTransactions: [],
        blockInterval: [],
        addressGrowth: []
      }
    },
    async asyncData({req, error}) {
      try {
        let [dailyTransactions, blockInterval, addressGrowth] = await Promise.all([
          Misc.dailyTransactions({ip: req && req.ip}),
          Misc.blockInterval({ip: req && req.ip}),
          Misc.addressGrowth({ip: req && req.ip})
        ])
        return {dailyTransactions, blockInterval, addressGrowth}
      } catch (err) {
        if (err instanceof RequestError) {
          error({statusCode: err.code, message: err.message})
        } else {
          error({statusCode: 500, message: err.message})
        }
      }
    },
    methods: {
      async renderDailyTransactionsChart() {
        const [echarts] = await Promise.all([
          import('echarts/lib/echarts'),
          import('echarts/lib/chart/bar'),
          import('echarts/lib/component/title'),
          import('echarts/lib/component/tooltip'),
          import('echarts/lib/component/dataZoom')
        ])
        let chart = echarts.init(this.$refs['daily-transactions'])
        chart.setOption({
          title: {text: this.$t('misc.stats.daily_transactions')},
          tooltip: {trigger: 'axis', axisPointer: {axis: 'x'}},
          xAxis: {type: 'time'},
          yAxis: {type: 'value', minInterval: 1},
          series: [
            {
              type: 'bar',
              name: this.$tc('misc.stats.contract_transactions', 2),
              stack: 1,
              itemStyle: {color: '#64cc6d'},
              data: this.dailyTransactions.map(({time, contractTransactionCount}) => [time, contractTransactionCount])
            },
            {
              type: 'bar',
              name: this.$tc('misc.stats.total_transactions', 2),
              stack: 1,
              itemStyle: {color: 'rgba(46, 154, 208, 1)'},
              data: this.dailyTransactions.map(({time, transactionCount, contractTransactionCount}) => [
                time, transactionCount - contractTransactionCount, transactionCount
              ]),
              encode: {
                x: 0,
                y: 1,
                tooltip: 2
              }
            }
          ],
          dataZoom: {
            type: 'slider',
            startValue: Date.now() - 30 * 24 * 3600 * 1000
          },
          useUTC: true
        })
      },
      async renderBlockIntervalChart() {
        const [echarts] = await Promise.all([
          import('echarts/lib/echarts'),
          import('echarts/lib/chart/bar'),
          import('echarts/lib/chart/line'),
          import('echarts/lib/component/title'),
          import('echarts/lib/component/tooltip'),
          import('echarts/lib/component/dataZoom')
        ])
        let total = this.blockInterval.reduce((initial, {count}) => initial + count, 0)
        let maxInterval = Math.ceil(Math.log(total * 2 / 9) / Math.log(9 / 8))
        let chart = echarts.init(this.$refs['block-interval'])
        chart.setOption({
          title: {text: this.$t('misc.stats.block_interval')},
          tooltip: {trigger: 'axis', axisPointer: {axis: 'x'}},
          xAxis: {
            type: 'value',
            name: this.$t('misc.stats.interval'),
            minInterval: 16
          },
          yAxis: {
            type: 'value',
            name: this.$t('misc.stats.blocks'),
            minInterval: 1
          },
          series: {
            type: 'bar',
            name: this.$t('misc.stats.blocks'),
            symbol: 'none',
            itemStyle: {color: 'rgba(46, 154, 208, 1)'},
            lineStyle: {color: 'rgba(46, 154, 208, 1)'},
            data: this.blockInterval.map(({interval, count}) => [interval, count])
          },
          dataZoom: {type: 'slider', endValue: 600}
        })
      },
      async renderAddressGrowth() {
        const [echarts] = await Promise.all([
          import('echarts/lib/echarts'),
          import('echarts/lib/chart/line'),
          import('echarts/lib/component/title'),
          import('echarts/lib/component/tooltip'),
          import('echarts/lib/component/dataZoom')
        ])
        let chart = echarts.init(this.$refs['address-growth'])
        chart.setOption({
          title: {text: this.$t('misc.stats.address_growth')},
          tooltip: {trigger: 'axis', axisPointer: {axis: 'x'}},
          xAxis: {type: 'time'},
          yAxis: {type: 'value', minInterval: 1},
          series: {
            type: 'line',
            name: this.$tc('blockchain.address', 2),
            smooth: true,
            symbol: 'none',
            itemStyle: {color: 'rgba(46, 154, 208, 1)'},
            lineStyle: {color: 'rgba(46, 154, 208, 1)'},
            data: this.addressGrowth.map(({time, addresses}) => [time, addresses])
          },
          dataZoom: {type: 'slider'},
          useUTC: true
        })
      }
    },
    mounted() {
      this.renderDailyTransactionsChart()
      this.renderBlockIntervalChart()
      this.renderAddressGrowth()
      console.log(this.dailyTransactions)
    }
  }
</script>

<style lang="less" scoped>
  .chart-wrapper {
    position: relative;
    &:not(:first-child) {
      margin-top: 1em;
    }
    @media (max-width: 768px) {
      padding-top: 200% / 3;
    }
    @media (min-width: 769px) {
      padding-top: 100% / 3;
    }
  }
  .chart {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
</style>
