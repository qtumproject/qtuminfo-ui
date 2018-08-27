import * as QtuminfoAPI from '@/services/qtuminfo-api'

class Misc {
  static info(options = {}) {
    return QtuminfoAPI.get('/info', options)
  }

  static dailyTransactions(options = {}) {
    return QtuminfoAPI.get('/stats/daily-transactions', options)
  }

  static blockInterval(options = {}) {
    return QtuminfoAPI.get('/stats/block-interval', options)
  }

  static coinstake(options = {}) {
    return QtuminfoAPI.get('/stats/coinstake', options)
  }

  static addressGrowth(options = {}) {
    return QtuminfoAPI.get('/stats/address-growth', options)
  }

  static richList({from, to}, options = {}) {
    return QtuminfoAPI.get(`/misc/rich-list`, {params: {page: from / (to - from), pageSize: to - from}, ...options})
  }

  static biggestMiners({from, to}, options = {}) {
    return QtuminfoAPI.get(`/misc/biggest-miners`, {params: {page: from / (to - from), pageSize: to - from}, ...options})
  }
}

export default Misc
