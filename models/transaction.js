import * as QtumscanAPI from '@/services/qtumscan-api'

class Transaction {
  static get(hash) {
    return QtumscanAPI.get(`/tx/${hash}`)
  }

  static mergeInputs(inputs) {
    let result = []
    for (let input of inputs) {
      let item = result.find(x => x.address === input.address)
      if (item) {
        item.value += input.value
      } else {
        result.push({
          address: input.address,
          value: input.value
        })
      }
    }
    return result
  }

  static mergeOutputs(outputs) {
    let result = []
    for (let output of outputs) {
      let cloned = JSON.parse(JSON.stringify(output))
      if ('addresses' in cloned.scriptPubKey) {
        let item = result.find(x => (
          x.scriptPubKey.addresses
          && x.scriptPubKey.addresses[0] === output.scriptPubKey.addresses[0]
        ))
        if (item) {
          item.value += output.value
          continue
        }
      }
      result.push(cloned)
    }
    return result
  }
}

export default Transaction
