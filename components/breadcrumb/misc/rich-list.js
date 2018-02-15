import {i18n} from '@/plugins/i18n'

export default {
  functional: true,
  render(createElement) {
    return [
      createElement('span', {staticClass: 'fa fa-info'}),
      ['Rich List']
    ]
  }
}
