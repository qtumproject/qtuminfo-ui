import * as QtuminfoAPI from '@/services/qtuminfo-api'

class Transaction {
  static get(hash) {
    return QtuminfoAPI.get(`/tx/${hash}`)
  }
}

export default Transaction
