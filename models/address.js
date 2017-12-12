import * as QtumscanAPI from '@/services/qtumscan-api'

class Address {
  static get(hash, params = {}) {
    return QtumscanAPI.get(`/address/${hash}`, {params})
  }

  static getUtxo(hash) {
    return QtumscanAPI.get(`/address/${hash}/utxo`)
  }
}

export default Address
