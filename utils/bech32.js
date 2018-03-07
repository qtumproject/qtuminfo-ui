const CHARSET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l'
const GENERATOR = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3]

function polymod(values) {
  let chk = 1
  for (let value of values) {
    let top = chk >> 25
    chk = (chk & 0x1ffffff) << 5 ^ value
    for (let i = 0; i < 5; ++i) {
      if ((top >> i) & 1) {
        chk ^= GENERATOR[i]
      }
    }
  }
  return chk
}

function hrpExpand(hrp) {
  let ret = []
  for (let p = 0; p < hrp.length; ++p) {
    ret.push(hrp.charCodeAt(p) >> 5)
  }
  ret.push(0)
  for (let p = 0; p < hrp.length; ++p) {
    ret.push(hrp.charCodeAt(p) & 31)
  }
  return ret
}

function verifyChecksum(hrp, data) {
  return polymod(hrpExpand(hrp).concat(data)) === 1
}

function createChecksum(hrp, data) {
  let values = hrpExpand(hrp).concat(data).concat([0, 0, 0, 0, 0, 0])
  let mod = polymod(values) ^ 1
  let ret = []
  for (let p = 0; p < 6; ++p) {
    ret.push((mod >> 5 * (5 - p)) & 31)
  }
  return ret
}

export function encode(hrp, data) {
  let combined = data.concat(createChecksum(hrp, data))
  let ret = hrp + '1'
  for (let p = 0; p < combined.length; ++p) {
    ret += CHARSET.charAt(combined[p])
  }
  return ret
}

export function decode(bechString) {
  let has_lower = false
  let has_upper = false
  for (let p = 0; p < bechString.length; ++p) {
    if (bechString.charCodeAt(p) <= 0x20 || bechString.charCodeAt(p) >= 0x7f) {
      return null
    }
    if (bechString.charCodeAt(p) >= 0x41 && bechString.charCodeAt(p) <= 0x5a) {
      has_upper = true
    }
    if (bechString.charCodeAt(p) >= 0x61 && bechString.charCodeAt(p) <= 0x7a) {
      has_lower = true
    }
  }
  if (has_lower && has_upper) {
    return null
  }
  bechString = bechString.toLowerCase()
  let pos = bechString.lastIndexOf('1')
  if (pos < 1 || pos + 7 > bechString.length || bechString.length > 90) {
    return null
  }
  let hrp = bechString.slice(0, pos)
  let data = []
  for (let p = pos + 1; p < bechString.length; ++p) {
    let d = CHARSET.indexOf(bechString[p])
    if (d === -1) {
      return null
    }
    data.push(d)
  }
  if (!verifyChecksum(hrp, data)) {
    return null
  }
  return {hrp, data: data.slice(0, -6)}
}
