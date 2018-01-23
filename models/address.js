import * as QtuminfoAPI from '@/services/qtuminfo-api'

class Address {
  static get(hash, params = {}) {
    return QtuminfoAPI.get(`/address/${hash}`, {params})
  }

  static getUtxo(hash) {
    return QtuminfoAPI.get(`/address/${hash}/utxo`)
  }

  static getTransactions(hash, {from, to}) {
    return QtuminfoAPI.get(`/addresses/${hash}/txs`, {params: {from, to}})
  }
}

export default Address
