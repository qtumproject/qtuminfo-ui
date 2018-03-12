import {i18n} from '@/plugins/i18n'

export default {
  functional: true,
  render(createElement) {
    return [i18n.t('contract.token.tokens')]
  }
}
