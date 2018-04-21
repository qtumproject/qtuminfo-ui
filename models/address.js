import * as QtuminfoAPI from '@/services/qtuminfo-api'

class Address {
  static get(id, options = {}) {
    return QtuminfoAPI.get(`/address/${id}`, options)
  }

  static getBalance(id, options = {}) {
    return QtuminfoAPI.get(`/address/${id}/balance`, options)
  }

  static getUtxo(id, options = {}) {
    return QtuminfoAPI.get(`/address/${id}/utxo`, options)
  }

  static getTransactions(id, {from, to}, options = {}) {
    return QtuminfoAPI.get(`/address/${id}/full-txs`, {params: {from, to}, ...options})
  }

  static getBalanceTransactions(id, {from, to}, options = {}) {
    return QtuminfoAPI.get(`/address/${id}/txs`, {params: {from, to}, ...options})
  }

  static getTokenBalanceTransactions(id, {tokens, from, to}, options = {}) {
    return QtuminfoAPI.get(`/address/${id}/token-txs`, {params: {tokens, from, to}, ...options})
  }
}

export default Address
