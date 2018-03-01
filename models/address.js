import * as QtuminfoAPI from '@/services/qtuminfo-api'

class Address {
  static get(hash) {
    return QtuminfoAPI.get(`/address/${hash}`)
  }

  static getUtxo(hash) {
    return QtuminfoAPI.get(`/address/${hash}/utxo`)
  }

  static getTransactions(hash, {from, to}) {
    return QtuminfoAPI.get(`/address/${hash}/txs`, {params: {from, to}})
  }
}

export default Address
