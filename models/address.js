import * as QtuminfoAPI from '@/services/qtuminfo-api'

class Address {
  static get(id) {
    return QtuminfoAPI.get(`/address/${id}`)
  }

  static getUtxo(id) {
    return QtuminfoAPI.get(`/address/${id}/utxo`)
  }

  static getTransactions(id, {from, to}) {
    return QtuminfoAPI.get(`/address/${id}/full-txs`, {params: {from, to}})
  }

  static getBalanceTransactions(id, {from, to}) {
    return QtuminfoAPI.get(`/address/${id}/txs`, {params: {from, to}})
  }

  static getTokenBalanceTransactions(id, {tokens, from, to}) {
    return QtuminfoAPI.get(`/address/${id}/token-txs`, {params: {tokens, from, to}})
  }
}

export default Address
