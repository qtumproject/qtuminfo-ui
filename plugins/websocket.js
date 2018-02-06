import Vue from 'vue'
import WS from '@/services/websocket'

export default function({app}) {
  let ws = new WS(process.env.qtuminfoWSBase)
  ws.on('height', height => app.store.commit('blockchain/height', height))
  ws.on('block', block => app.store.commit('blockchain/block', block))
  ws.on('transaction', transaction => app.store.commit('blockchain/transaction', transaction))

  Object.assign(Vue.prototype, {
    get $websocket() {
      return ws
    }
  })
}
