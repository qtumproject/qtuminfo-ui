import Vue from 'vue'
import WS from '@/services/websocket'

export default function({app}) {
  let ws = new WS(
    (location.protocol === 'https:' ? 'wss:' : 'ws:') + process.env.qtuminfoWSBase,
    {autoSubscribeAfterReconnect: true}
  )
  ws.on('height', height => app.store.commit('blockchain/height', height))

  Object.assign(Vue.prototype, {
    get $websocket() {
      return ws
    }
  })
}
