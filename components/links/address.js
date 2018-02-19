import mergeProps from '@/utils/merge-props'
import Clipboard from './clipboard.vue'
import './style.less'

export default {
  name: 'address-link',
  functional: true,
  props: {
    address: {type: String, required: true},
    highlight: Boolean
  },
  render(createElement, {data, props, slots}) {
    return createElement(
      'span',
      mergeProps(data, {class: 'address-link'}),
      [
        props.highlight
          ? createElement(
            'span',
            {class: ['break-word', 'monospace']},
            slots().default || props.address
          )
          : createElement(
            'nuxt-link',
            {
              class: ['break-word', 'monospace'],
              attrs: {to: (props.address.length === 34 ? '/address/' : '/contract/') + props.address}
            },
            slots().default || props.address
          ),
        ' ',
        createElement(Clipboard, {attrs: {string: props.address}})
      ]
    )
  }
}
