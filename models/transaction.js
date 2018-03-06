import * as QtuminfoAPI from '@/services/qtuminfo-api'

class Transaction {
  static get(id) {
    if (Array.isArray(id)) {
      return QtuminfoAPI.get('/txs/' + id.join(','))
    } else {
      return QtuminfoAPI.get(`/tx/${id}`)
    }
  }
}

export default Transaction
