import mergeProps from '@/utils/merge-props'
import Clipboard from '../clipboard.vue'
import './style.less'

export default {
  name: 'address-link',
  functional: true,
  props: {
    address: {type: String, required: true},
    plain: {type: Boolean, default: false},
    highlight: {type: [String, Array], default: () => []},
    clipboard: {type: Boolean, default: true}
  },
  render(createElement, {data, props, slots}) {
    let highlight = Array.isArray(props.highlight) ? props.highlight : [props.highlight]
    let children = [
      props.plain || props.highlight.includes(props.address)
        ? createElement(
          'span',
          {class: ['break-word', 'monospace']},
          slots().default || props.address
        )
        : createElement(
          'nuxt-link',
          {
            class: ['break-word', 'monospace'],
            attrs: {
              to: {
                name: props.address.length === 40 ? 'contract-id' : 'address-id',
                params: {id: props.address}
              }
            }
          },
          slots().default || props.address
        )
    ]
    if (props.clipboard) {
      children.push(createElement(Clipboard, {attrs: {string: props.address}}))
    }
    return createElement(
      'span',
      mergeProps(data, {class: 'address-link'}),
      children
    )
  }
}
