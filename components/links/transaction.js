import mergeProps from '@/utils/merge-props'
import Clipboard from './clipboard.vue'
import './style.less'

export default {
  name: 'transaction-link',
  functional: true,
  props: {
    transaction: {type: String, required: true}
  },
  render(createElement, {data, props}) {
    return createElement(
      'span',
      mergeProps(data, {class: 'transaction-link'}),
      [
        createElement(
          'nuxt-link',
          {
            class: ['break-word', 'monospace'],
            attrs: {to: '/tx/' + props.transaction}
          },
          props.transaction
        ),
        ' ',
        createElement(Clipboard, {attrs: {string: props.transaction}})
      ]
    )
  }
}
