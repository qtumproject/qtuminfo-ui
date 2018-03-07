import {fromHexAddress, toHexAddress} from '@/utils/address'
import {Base58Check} from '@/utils/base58'
import network from '@/utils/network'
import mergeProps from '@/utils/merge-props'
import Clipboard from '../clipboard.vue'
import './style.less'

export default {
  name: 'address-link',
  functional: true,
  props: {
    address: {required: true},
    plain: {type: Boolean, default: false},
    highlight: {type: [String, Boolean], default: false},
    clipboard: {type: Boolean, default: true}
  },
  render(createElement, {data, props, slots}) {
    let addressString
    let hexAddress
    if (typeof props.address === 'string') {
      addressString = props.address
      hexAddress = toHexAddress(props.address)
    } else {
      addressString = fromHexAddress(props.address)
      hexAddress = toHexAddress(addressString)
    }
    let children = [
      props.plain || [true, hexAddress].includes(props.highlight)
        ? createElement(
          'span',
          {class: ['break-word', 'monospace']},
          slots().default || addressString
        )
        : createElement(
          'nuxt-link',
          {
            class: ['break-word', 'monospace'],
            attrs: {
              to: {
                name: addressString.length === 40 ? 'contract-id' : 'address-id',
                params: {id: addressString}
              }
            }
          },
          slots().default || addressString
        )
    ]
    if (props.clipboard) {
      children.push(createElement(Clipboard, {attrs: {string: addressString}}))
    }
    return createElement(
      'span',
      mergeProps(data, {class: 'address-link'}),
      children
    )
  }
}
