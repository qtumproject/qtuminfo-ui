import {Bech32, Bech32m} from './bech32'
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

  static encodeV0(hrp, version, program) {
    let ret = Bech32.encode(hrp, [version].concat(SegwitAddress.convertbits(program, 8, 5, true)))
    if (SegwitAddress.decodeV0(hrp, ret) === null) {
      return null
    } else {
      return ret
    }
  }

  static decodeV0(hrp, addr) {
    let dec = Bech32.decode(addr)
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

  static encode(hrp, version, program) {
    let ret = Bech32m.encode(hrp, [version].concat(SegwitAddress.convertbits(program, 8, 5, true)))
    if (SegwitAddress.decode(hrp, ret) === null) {
      return null
    } else {
      return ret
    }
  }

  static decode(hrp, addr) {
    let dec = Bech32m.decode(addr)
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

export function checkAddress(address) {
  try {
    if (address.length === 34) {
      let hexAddress = Base58Check.decode(address)
      return [network.pubkeyhash, network.scripthash].includes(hexAddress[0])
    } else if (/^[0-9a-f]{40}$/.test(address)) {
      return true
    } else if (address.length === 42) {
      return Boolean(SegwitAddress.decodeV0(network.witness_hrp, address))
    } else if (address.length === 62) {
      return Boolean(
        SegwitAddress.decodeV0(network.witness_hrp, address)
        || SegwitAddress.decode(network.witness_hrp, address)
      )
    }
    return false
  } catch (err) {
    return false
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
    let result = SegwitAddress.decodeV0(network.witness_hrp, address)
    if (result) {
      return Buffer.from(result.program).toString('hex')
    }
  } else if (address.length === 62) {
    let result = SegwitAddress.decodeV0(network.witness_hrp, address)
    if (result) {
      return Buffer.from(result.program).toString('hex')
    }
    result = SegwitAddress.decode(network.witness_hrp, address)
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
    return SegwitAddress.encodeV0(network[type], 0, Buffer.from(hex, 'hex'))
  } else if (type === 'witness_v1_taproot') {
    return SegwitAddress.encode(network[type], 1, Buffer.from(hex, 'hex'))
  }
}

export function extendAddress(address) {
  if (address.length === 34) {
    let hexAddress = Base58Check.decode(address)
    if (hexAddress[0] === network.pubkeyhash) {
      return [
        address,
        Base58Check.encode(Buffer.concat([Buffer.from([network.scripthash]), hexAddress.slice(1)])),
        SegwitAddress.encodeV0(network.witness_hrp, 0, hexAddress.slice(1))
      ]
    } else if (hexAddress[0] === network.scripthash) {
      return [address]
    }
  } else if (address.length === 40) {
    return [address]
  } else if (address.length === 42) {
    let result = SegwitAddress.decodeV0(network.witness_hrp, address)
    if (result) {
      let hexAddress = Buffer.from(result.program)
      return [
        Base58Check.encode(Buffer.concat([Buffer.from([network.pubkeyhash]), hexAddress])),
        Base58Check.encode(Buffer.concat([Buffer.from([network.scripthash]), hexAddress])),
        address
      ]
    }
  } else if (address.length === 62) {
    let result = SegwitAddress.decodeV0(network.witness_hrp, address)
    if (result) {
      return [address]
    }
    result = SegwitAddress.decode(network.witness_hrp, address)
    if (result) {
      return [address]
    }
  }
}
