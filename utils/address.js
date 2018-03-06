import {Base58Check} from './base58'
import network from './network'

export function toHexAddress(address) {
  if (address.length === 34) {
    let hexAddress = Base58Check.decode(address)
    if ([network.pubkeyhash, network.scripthash].includes(hexAddress[0])) {
      return hexAddress.slice(1).toString('hex')
    }
  } else if (address.length === 40) {
    return address
  }
}
