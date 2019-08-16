import {i18n} from '@/plugins/i18n'

export default {
  functional: true,
  render(createElement, {props}) {
    return [
      // createElement('Icon', {props: {icon: 'cubes'}}),
      createElement('span', {staticClass: 'monospace'}, '交易列表')
    ]
  }
}
