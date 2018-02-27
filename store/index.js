import qtuminfoAPI from '@/services/qtuminfo-api'
import {getLocale} from '@/plugins/i18n'

export const actions = {
  async nuxtServerInit({commit}, {req}) {
    let {data} = await qtuminfoAPI.get('/info')
    commit('blockchain/height', data.height)
    commit('locale/language', getLocale(req))
  }
}
