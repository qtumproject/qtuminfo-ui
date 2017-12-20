import * as QtumscanAPI from '@/services/qtumscan-api'

class Address {
  static get(hash, params = {}) {
    return QtumscanAPI.get(`/address/${hash}`, {params})
  }

  static getUtxo(hash) {
    return QtumscanAPI.get(`/address/${hash}/utxo`)
  }

  static getTransactions(hash, {from, to}) {
    return QtumscanAPI.get(`/addresses/${hash}/txs`, {params: {from, to}})
  }
}

export default Address
