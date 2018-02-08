import Vue from 'vue'
import WS from '@/services/websocket'

export default function({app}) {
  let ws = new WS(process.env.qtuminfoWSBase)
  ws.on('height', height => app.store.commit('blockchain/height', height))

  Object.assign(Vue.prototype, {
    get $websocket() {
      return ws
    }
  })
}
