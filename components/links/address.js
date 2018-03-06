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
    highlight: Boolean,
    copyable: {type: Boolean, default: true}
  },
  render(createElement, {data, props, slots}) {
    let addressString
    if (typeof props.address === 'string') {
      addressString = props.address
    } else if (props.address.type === 'contract') {
      addressString = props.address.hex
    } else {
      let type = props.address.type.includes('scripthash') ? 'scripthash' : 'pubkeyhash'
      addressString = Base58Check.encode(Buffer.concat([
        Buffer.from([network[type]]),
        Buffer.from(props.address.hex, 'hex')
      ]))
    }
    let children = [
      props.highlight
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
        ),
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
