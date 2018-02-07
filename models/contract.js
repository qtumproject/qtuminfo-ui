import * as QtuminfoAPI from '@/services/qtuminfo-api'

class Contract {
  static get(hash) {
    return QtuminfoAPI.get(`/contract/${hash}`)
  }

  static getUtxo(hash) {
    return QtuminfoAPI.get(`/contract/${hash}/utxo`)
  }

  static getTransactions(hash, {from, to}) {
    return QtuminfoAPI.get(`/contract/${hash}/txs`, {params: {from, to}})
  }
}

export default Contract
