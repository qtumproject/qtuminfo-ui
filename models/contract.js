import * as QtumscanAPI from '@/services/qtumscan-api'

class Contract {
  static get(hash, params = {}) {
    return QtumscanAPI.get(`/contract/${hash}`, {params})
  }

  static getUtxo(hash) {
    return QtumscanAPI.get(`/contract/${hash}/utxo`)
  }

  static getTransactions(hash, {from, to}) {
    return QtumscanAPI.get(`/contract/${hash}/txs`, {params: {from, to}})
  }
}

export default Contract
