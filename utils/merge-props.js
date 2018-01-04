let nestRE = /^(attrs|props|on|nativeOn|class|style|hook)$/

function mergeFn(a, b) {
  return (...args) => {
    a && a(...args)
    b && b(...args)
  }
}

export default (...objects) => objects.reduce((a, b = {}) => {
  for (let key of Object.keys(b)) {
    let aa = a[key]
    let bb = b[key]
    if (bb === undefined) {
      continue
    }
    if (aa && nestRE.test(key)) {
      if (key === 'class') {
        if (typeof aa === 'string') {
          a[key] = aa = {[aa]: true}
        }
        if (typeof bb === 'string') {
          b[key] = bb = {[bb]: true}
        }
      }
      if (['on', 'nativeOn', 'hook'].includes(key)) {
        for (let nestedKey of Object.keys(bb)) {
          aa[nestedKey] = mergeFn(aa[nestedKey], bb[nestedKey])
        }
      } else if (Array.isArray(aa)) {
        a[key] = aa.concat(bb)
      } else if (Array.isArray(bb)) {
        a[key] = [aa].concat(bb)
      } else {
        Object.assign(aa, bb)
      }
    } else if (key === 'staticClass' && aa && bb) {
      a[key] = aa + ' ' + bb
    } else {
      a[key] = b[key]
    }
  }
  return a
}, {})
