import qtuminfoAPI from '@/services/qtuminfo-api'

export const actions = {
  async nuxtServerInit({commit}) {
    let {data} = await qtuminfoAPI.get('/info')
    commit('blockchain/height', data.height)
  }
}
