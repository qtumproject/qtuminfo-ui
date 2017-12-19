import mergeProps from '@/utils/merge-props'

export default {
  name: 'attribute-injector',
  functional: true,
  render(createElement, {data, children}) {
    for (let child of children) {
      if (child.tag) {
        child.data = mergeProps(child.data, data)
      }
    }
    return children
  }
}
