import {i18n} from '@/plugins/i18n'

export default {
  functional: true,
  props: {
    id: {type: String, required: true}
  },
  render(createElement, {props}) {
    return [
      createElement('Icon', {props: {icon: 'code'}}),
      createElement('span', {staticClass: 'monospace'}, [i18n.tc('blockchain.contract', 1) + ' ' + props.id])
    ]
  }
}
