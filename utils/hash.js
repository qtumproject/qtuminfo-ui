import crypto from 'crypto-browserify'

export function sha1(buffer) {
  return crypto.createHash('sha1').update(buffer).digest()
}
sha1.blocksize = 512

export function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest()
}
sha256.blocksize = 512

export function sha256sha256(buffer) {
  return sha256(sha256(buffer))
}

export function ripemd160(buffer) {
  return crypto.createHash('ripemd160').update(buffer).digest()
}

export function sha256ripemd160(buffer) {
  assert(Buffer.isBuffer(buffer))
  return ripemd160(sha256(buffer))
}

export function sha512(buffer) {
  return crypto.createHash('sha512').update(buffer).digest()
}
sha512.blocksize = 1024

export function hmac(hashf, data, key) {
  let blocksize = hashf.blocksize >>> 3
  if (key.length > blocksize) {
    key = hashf(key)
  } else if (key.length < blocksize) {
    let fill = Buffer.alloc(blocksize)
    key.copy(fill)
    key = fill
  }

  let o_key = Buffer.alloc(blocksize, 0x5c)
  let i_key = Buffer.alloc(blocksize, 0x36)
  let o_key_pad = Buffer.alloc(blocksize)
  let i_key_pad = Buffer.alloc(blocksize)
  for (let i = 0; i < blocksize; ++i) {
    o_key_pad[i] = o_key[i] ^ key[i]
    i_key_pad[i] = i_key[i] ^ key[i]
  }

  return hashf(Buffer.concat([
    o_key_pad, hashf(Buffer.concat([i_key_pad, data]))
  ]))
}

export function sha256hmac(data, key) {
  return hmac(sha256, data, key)
}

export function sha512hmac(data, key) {
  return hmac(sha512, data, key)
}
