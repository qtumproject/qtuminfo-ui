import * as QtuminfoAPI from '@/services/qtuminfo-api'

class Contract {
  static get(id, options = {}) {
    return QtuminfoAPI.get(`/contract/${id}`, options)
  }

  static getUtxo(id, options = {}) {
    return QtuminfoAPI.get(`/contract/${id}/utxo`, options)
  }

  static getTransactions(id, {from, to}, options = {}) {
    return QtuminfoAPI.get(`/contract/${id}/txs`, {params: {from, to}, ...options})
  }

  static listTokens({from, to}, options = {}) {
    return QtuminfoAPI.get(`/contract/tokens`, {params: {from, to}, ...options})
  }

  static richList(id, {from, to}, options = {}) {
    return QtuminfoAPI.get(`/contract/${id}/rich-list`, {params: {from, to}, ...options})
  }
}

export default Contract
