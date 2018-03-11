import * as QtuminfoAPI from '@/services/qtuminfo-api'

class Transaction {
  static get(id) {
    if (Array.isArray(id)) {
      if (id.length === 0) {
        return []
      } else {
        return QtuminfoAPI.get('/txs/' + id.join(','))
      }
    } else {
      return QtuminfoAPI.get(`/tx/${id}`)
    }
  }
}

export default Transaction
