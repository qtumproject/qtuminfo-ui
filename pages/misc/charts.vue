<template>
  <section class="container">
    <div class="chart-wrapper">
      <div class="chart" ref="daily-transactions"></div>
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
        dailyTransactions: []
      }
    },
    async asyncData({req, error}) {
      try {
        let dailyTransactions = await Misc.dailyTransactions({ip: req && req.ip})
        return {dailyTransactions}
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
          import('echarts/lib/chart/line'),
          import('echarts/lib/component/title'),
          import('echarts/lib/component/tooltip'),
          import('echarts/lib/component/dataZoom')
        ])
        let chart = echarts.init(this.$refs['daily-transactions'])
        chart.setOption({
          title: {text: this.$t('misc.stats.daily_transactions')},
          tooltip: {trigger: 'axis', axisPointer: {axis: 'x'}},
          xAxis: {type: 'time'},
          yAxis: {type: 'value'},
          series: {
            type: 'line',
            name: this.$tc('blockchain.transaction', 2),
            smooth: true,
            smoothMonotone: 'x',
            itemStyle: {color: 'rgba(46, 154, 208, 1)'},
            lineStyle: {color: 'rgba(46, 154, 208, 1)'},
            areaStyle: {
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  {offset: 0, color: 'rgba(46, 154, 208, 0.8)'},
                  {offset: 1, color: 'rgba(46, 154, 208, 0.2)'}
                ]
              }
            },
            data: this.dailyTransactions.map(({time, transactions}) => [time, transactions])
          },
          dataZoom: {type: 'slider'},
          useUTC: true
        })
      }
    },
    mounted() {
      this.renderDailyTransactionsChart()
    }
  }
</script>

<style lang="less" scoped>
  .chart-wrapper {
    position: relative;
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
