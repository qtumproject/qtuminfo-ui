import * as bech32 from './bech32'
import {Base58Check} from './base58'
import network from './network'

class SegwitAddress {
  static convertbits(data, frombits, tobits, pad) {
    let acc = 0;
    let bits = 0;
    let ret = [];
    let maxv = (1 << tobits) - 1
    for (let value of data) {
      if (value < 0 || (value >> frombits) !== 0) {
        return null
      }
      acc = (acc << frombits) | value
      bits += frombits
      while (bits >= tobits) {
        bits -= tobits
        ret.push((acc >> bits) & maxv)
      }
    }
    if (pad) {
      if (bits > 0) {
        ret.push((acc << (tobits - bits)) & maxv)
      }
    } else if (bits >= frombits || ((acc << (tobits - bits)) & maxv)) {
      return null
    }
    return ret
  }

  static encode(hrp, version, program) {
    let ret = bech32.encode(hrp, [version].concat(SegwitAddress.convertbits(program, 8, 5, true)))
    if (SegwitAddress.decode(hrp, ret) === null) {
      return null
    } else {
      return ret
    }
  }

  static decode(hrp, addr) {
    let dec = bech32.decode(addr)
    if (dec === null || dec.hrp !== hrp || dec.data.length < 1 || dec.data[0] > 16) {
      return null
    }
    let res = SegwitAddress.convertbits(dec.data.slice(1), 5, 8, false)
    if (res === null || res.length < 2 || res.length > 40) {
      return null
    } else if (dec.data[0] === 0 && res.length !== 20 && res.length !== 32) {
      return null
    } else {
      return {version: dec.data[0], program: res}
    }
  }
}

export function toHexAddress(address) {
  if (address.length === 34) {
    let hexAddress = Base58Check.decode(address)
    if ([network.pubkeyhash, network.scripthash].includes(hexAddress[0])) {
      return hexAddress.slice(1).toString('hex')
    }
  } else if (address.length === 40) {
    return address
  } else if (address.length === 42) {
    let result = SegwitAddress.decode(network.witness_v0_keyhash, address)
    if (result) {
      return Buffer.from(result.program).toString('hex')
    }
  } else if (address.length === 62) {
    let result = SegwitAddress.decode(network.witness_v0_scripthash, address)
    if (result) {
      return Buffer.from(result.program).toString('hex')
    }
  }
}

export function fromHexAddress({type, hex}) {
  if (type === 'contract') {
    return hex
  } else if (['pubkey', 'pubkeyhash', 'scripthash'].includes(type)) {
    return Base58Check.encode(Buffer.concat([
      Buffer.from([network[type]]),
      Buffer.from(hex, 'hex')
    ]))
  } else if (['witness_v0_keyhash', 'witness_v0_scripthash'].includes(type)) {
    return SegwitAddress.encode(network[type], 0, Buffer.from(hex, 'hex'))
  }
}
