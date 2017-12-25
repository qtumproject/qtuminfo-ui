import Vue from 'vue'
import moment from 'moment'

Vue.filter('qtum', (satoshis, precision = null) => {
  function replace(string) {
    return string.replace(/^(\d{1,3})((\d{3})*)(\.\d+|)$/g, (_, before, middle, __, after) => {
      return before + middle.replace(/(\d{3})/g, ',$1') + after
    })
  }
  if (precision == null) {
    let s = satoshis.toString().padStart(9, '0')
    return replace((s.slice(0, -8) + '.' + s.slice(-8)).replace(/\.?0*$/g, ''))
  } else {
    return replace((satoshis / 1e8).toFixed(precision))
  }
})

Vue.filter('timestamp', time => moment(time * 1000).format('YYYY-MM-DD HH:mm:ss'))
Vue.filter('from-now', time => moment(time * 1000).fromNow())

Vue.mixin({
  methods: {
    $printAmount(satoshis, precision = null) {
      return Vue.filter('qtum')(satoshis, precision)
    }
  }
})
