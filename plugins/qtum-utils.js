import Vue from 'vue'
import moment from 'moment'

function addAmountDelimiters(string) {
  return string.replace(/^(\d{1,3})((\d{3})*)(\.\d+|)$/g, (_, before, middle, __, after) => {
    return before + middle.replace(/(\d{3})/g, ',$1') + after
  })
}

Vue.filter('qtum', (satoshis, precision = null) => {
  if (precision == null) {
    let s = satoshis.toString().padStart(9, '0')
    return addAmountDelimiters((s.slice(0, -8) + '.' + s.slice(-8)).replace(/\.?0*$/g, ''))
  } else {
    return addAmountDelimiters((satoshis / 1e8).toFixed(precision))
  }
})

Vue.filter('qrc20', (amount, decimals = 0, showDecimals = false) => {
  if (decimals === 0) {
    return amount
  }
  let s = amount.toString().padStart(decimals + 1, '0')
  let integralPart = s.slice(0, -decimals)
  let decimalPart = s.slice(-decimals)
  let value = addAmountDelimiters(integralPart + '.' + decimalPart)
  if (showDecimals) {
    return value
  } else {
    return value.replace(/\.?0*$/g, '')
  }
})

Vue.filter('timestamp', (time, type = 'datetime') => moment(time * 1000).format({
  datetime: 'YYYY-MM-DD HH:mm:ss',
  date: 'YYYY-MM-DD',
  time: 'HH:mm:ss'
}[type]))

Vue.component('FromNow', {
  name: 'from-now',
  props: {
    timestamp: {type: Number, required: true},
    tag: {type: String, default: 'span'},
  },
  render(createElement) {
    return createElement(this.tag, '\n' + moment(this.timestamp * 1000).fromNow() + '\n')
  },
  mounted() {
    this.$interval = setInterval(() => this.$forceUpdate(), 1000)
  },
  beforeDestroy() {
    clearInterval(this.$interval)
  }
})
