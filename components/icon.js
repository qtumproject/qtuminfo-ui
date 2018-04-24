import mergeProps from '@/utils/merge-props'

export default {
  name: 'icon',
  functional: true,
  props: {
    icon: {type: String, required: true},
    solid: {type: Boolean, default: false},
    regular: {type: Boolean, required: false},
    light: {type: Boolean, required: false},
    brands: {type: Boolean, default: false},
    fixedWidth: {type: Boolean, default: false},
    tag: {type: String, default: 'span'}
  },
  render(createElement, {data, props, children}) {
    let prefix = 'fas'
    if (props.solid) {
      prefix = 'fas'
    } else if (props.regular) {
      prefix = 'far'
    } else if (props.light) {
      prefix = 'fal'
    } else if (props.brands) {
      prefix = 'fab'
    }
    return createElement(
      props.tag,
      mergeProps(
        data,
        {
          class: [
            prefix,
            ...props.icon.split(' ').map(s => 'fa-' + s),
            {'fa-fw': props.fixedWidth}
          ]
        }
      ),
      children
    )
  }
}
