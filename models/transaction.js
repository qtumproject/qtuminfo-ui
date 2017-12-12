import * as QtumscanAPI from '@/services/qtumscan-api'

class Transaction {
  static get(hash) {
    return QtumscanAPI.get(`/tx/${hash}`)
  }
}

export default Transaction
