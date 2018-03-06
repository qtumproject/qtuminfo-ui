import {toHexAddress} from '@/utils/address'
import {Base58Check} from '@/utils/base58'
import network from '@/utils/network'
import mergeProps from '@/utils/merge-props'
import Clipboard from './clipboard.vue'
import './style.less'

export default {
  name: 'address-link',
  functional: true,
  props: {
    address: {required: true},
    highlight: String,
    copyable: {type: Boolean, default: true}
  },
  render(createElement, {data, props, slots}) {
    let addressString
    let hexAddress
    if (typeof props.address === 'string') {
      addressString = props.address
      hexAddress = toHexAddress(props.address)
    } else if (props.address.type === 'contract') {
      addressString = hexAddress = props.address.hex
    } else {
      let type = props.address.type.includes('scripthash') ? 'scripthash' : 'pubkeyhash'
      addressString = Base58Check.encode(Buffer.concat([
        Buffer.from([network[type]]),
        Buffer.from(props.address.hex, 'hex')
      ]))
      hexAddress = props.address.hex
    }
    let children = [
      props.highlight === hexAddress
        ? createElement(
          'span',
          {class: ['break-word', 'monospace']},
          slots().default || addressString
        )
        : createElement(
          'nuxt-link',
          {
            class: ['break-word', 'monospace'],
            attrs: {to: (addressString.length === 40 ? '/contract/' : '/address/') + addressString}
          },
          slots().default || addressString
        )
    ]
    if (props.copyable) {
      children.push(' ', createElement(Clipboard, {attrs: {string: addressString}}))
    }
    return createElement(
      'span',
      mergeProps(data, {class: 'address-link'}),
      children
    )
  }
}
