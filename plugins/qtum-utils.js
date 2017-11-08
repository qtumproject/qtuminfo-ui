import Vue from 'vue'
import moment from 'moment'

Vue.mixin({
  methods: {
    $printSatoshis(satoshis) {
      let s = satoshis.toString().padStart(9, '0')
      return (s.slice(0, -8) + '.' + s.slice(-8)).replace(/\.?0*$/g, '')
    },
    get $moment() {
      return moment
    }
  }
})
