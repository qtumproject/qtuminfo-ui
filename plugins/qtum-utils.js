import Vue from 'vue'
import moment from 'moment'

Vue.filter('qtum', (satoshis, precision = null) => {
  if (precision == null) {
    let s = satoshis.toString().padStart(9, '0')
    return (s.slice(0, -8) + '.' + s.slice(-8)).replace(/\.?0*$/g, '')
  } else {
    return (satoshis / 1e8).toFixed(precision)
  }
})

Vue.mixin({
  methods: {
    $printAmount(satoshis, precision = null) {
      return Vue.filter('qtum')(satoshis, precision)
    },
    get $moment() {
      return moment
    }
  }
})
