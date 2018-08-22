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

  static getTransactions(id, {page, pageSize}, options = {}) {
    return QtuminfoAPI.get(`/address/${id}/txs`, {params: {page, pageSize}, ...options})
  }

  static getBalanceTransactions(id, {page, pageSize}, options = {}) {
    return QtuminfoAPI.get(`/address/${id}/balance-history`, {params: {page, pageSize}, ...options})
  }

  static getTokenBalanceTransactions(id, {tokens, page, pageSize}, options = {}) {
    return QtuminfoAPI.get(`/address/${id}/qrc20-balance-history`, {params: {tokens, page, pageSize}, ...options})
  }
}

export default Address
