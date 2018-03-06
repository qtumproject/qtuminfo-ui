import bs58 from 'bs58'
import {sha256sha256} from './hash'

export class Base58 {
  static encode(buffer) {
    return bs58.encode(buffer)
  }

  static decode(string) {
    return bs58.decode(string)
  }
}

export class Base58Check {
  static validChecksum(data, checksum) {
    if (!checksum) {
      checksum = data.slice(-4)
      data = data.slice(0, -4)
    }
    return Buffer.compare(Base58Check.checksum(data), checksum.toString('hex')) === 0
  }

  static decode(string) {
    let buffer = Base58.decode(string)
    let data = buffer.slice(0, -4)
    let checksum = buffer.slice(-4)
    let hash = sha256sha256(data)
    let hash4 = hash.slice(0, 4)
    if (Buffer.compare(checksum, hash4) === 0) {
      return data
    } else {
      throw new Error('Checksum mismatch')
    }
  }

  static checksum(buffer) {
    return sha256sha256(buffer).slice(0, 4)
  }

  static encode(buffer) {
    let checkedBuf = Buffer.alloc(buffer.length + 4)
    let hash = Base58Check.checksum(buffer)
    buffer.copy(checkedBuf)
    hash.copy(checkedBuf, buffer.length)
    return Base58.encode(checkedBuf)
  }
}
