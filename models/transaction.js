import * as QtuminfoAPI from '@/services/qtuminfo-api'

class Transaction {
  static get(id, options = {}) {
    if (Array.isArray(id)) {
      if (id.length === 0) {
        return []
      } else {
        return QtuminfoAPI.get('/txs/' + id.join(','), options)
      }
    } else {
      return QtuminfoAPI.get(`/tx/${id}`, options)
    }
  }
}

export default Transaction
