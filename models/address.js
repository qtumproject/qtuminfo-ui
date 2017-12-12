import * as QtumscanAPI from '@/services/qtumscan-api'

class Address {
  static get(hash) {
    return QtumscanAPI.get(`/address/${hash}`)
  }

  static getUtxo(hash) {
    return QtumscanAPI.get(`/address/${hash}/utxo`)
  }
}

export default Address
