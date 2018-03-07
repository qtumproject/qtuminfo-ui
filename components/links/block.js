import mergeProps from '@/utils/merge-props'
import Clipboard from '../clipboard.vue'
import './style.less'

export default {
  name: 'block-link',
  functional: true,
  props: {
    block: {type: [Number, String], required: true},
    plain: {type: Boolean, default: false},
    clipboard: {type: [Number, String, Boolean], default: true}
  },
  render(createElement, {data, props, slots}) {
    let children = [
      props.plain
        ? createElement(
          'span',
          {class: ['break-word', 'monospace']},
          slots().default || props.block.toString()
        )
        : createElement(
          'nuxt-link',
          {
            class: ['break-word', 'monospace'],
            attrs: {to: {name: 'block-id', params: {id: props.block}}}
          },
          slots().default || props.block.toString()
        )
    ]
    if (props.clipboard) {
      children.push(createElement(Clipboard, {attrs: {
        string: (props.clipboard === true ? props.block : props.clipboard).toString()
      }}))
    }
    return createElement(
      'span',
      mergeProps(data, {class: 'block-link'}),
      children
    )
  }
}
