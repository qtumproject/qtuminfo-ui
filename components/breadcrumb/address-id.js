import {i18n} from '@/plugins/i18n'

export default {
  functional: true,
  props: {
    id: {type: String, required: true}
  },
  render(createElement, {props}) {
    return [
      createElement('span', {staticClass: 'fa fa-cubes'}),
      createElement('span', {staticClass: 'monospace'}, [i18n.tc('blockchain.address', 1) + ' ' + props.id])
    ]
  }
}
