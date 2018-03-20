import * as QtuminfoAPI from '@/services/qtuminfo-api'

class Contract {
  static get(hash, options = {}) {
    return QtuminfoAPI.get(`/contract/${hash}`, options)
  }

  static getUtxo(hash, options = {}) {
    return QtuminfoAPI.get(`/contract/${hash}/utxo`, options)
  }

  static getTransactions(hash, {from, to}, options = {}) {
    return QtuminfoAPI.get(`/contract/${hash}/txs`, {params: {from, to}, ...options})
  }

  static listTokens({from, to}, options = {}) {
    return QtuminfoAPI.get(`/contract/tokens`, {params: {from, to}, ...options})
  }
}

export default Contract
