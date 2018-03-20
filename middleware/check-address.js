import {i18n} from '@/plugins/i18n'
import {checkAddress} from '@/utils/address'

export default function({params, error}) {
  for (let address of params.id.split(',')) {
    if (!checkAddress(address)) {
      return error({statusCode: 400, message: i18n.t('address.invalid_address') + ' ' + address})
    }
  }
}
