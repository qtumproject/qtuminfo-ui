import Vue from 'vue'
import io from 'socket.io-client'

export default function ({ app }) {
  let ws = io(
    'wss:' + process.env.qtuminfoWSBase,
    { transports: ['websocket'] }
  )
  ws.on('tip', tip => app.store.commit('blockchain/height', tip.height))
  ws.on('reorg', tip => app.store.commit('blockchain/height', tip.height))

  let subscriptions = {}
  let listeners = {}

  Object.assign(Vue.prototype, {
    $subscribe(room, event, callback) {
      let eventMapping = subscriptions[room]
      if (eventMapping) {
        let mapping = eventMapping[event]
        if (mapping) {
          mapping.set(callback, (mapping.get(callback) || 0) + 1)
        } else {
          eventMapping[event] = new Map([[callback, 1]])
        }
      } else {
        subscriptions[room] = { [event]: new Map([[callback, 1]]) }
        ws.emit('subscribe', room)
      }
      let listener = listeners[event]
      if (listener) {
        let count = listener.get(callback)
        if (count) {
          listener.set(callback, count + 1)
        } else {
          listener.set(callback, 1)
          ws.on(event, callback)
        }
      } else {
        listeners[event] = new Map([[callback, 1]])
        ws.on(event, callback)
      }
    },
    $unsubscribe(room, event, callback) {
      let eventMapping = subscriptions[room]
      if (eventMapping) {
        let mapping = eventMapping[event]
        if (mapping) {
          let count = mapping.get(callback)
          if (!count) {
            return
          } else if (count === 1) {
            mapping.delete(callback)
            if (mapping.size === 0) {
              delete eventMapping[event]
            }
          } else {
            mapping.set(callback, count - 1)
          }
        }
        if (Object.keys(eventMapping).length === 0) {
          delete subscriptions[room]
          ws.emit('unsubscribe', room)
        }
      }
      let listener = listeners[event]
      if (listener) {
        let count = listener.get(callback)
        if (count === 1) {
          listener.delete(callback)
          ws.off(event, callback)
        } else {
          listener.set(callback, count - 1)
        }
      }
    }
  })

  ws.on('reconnect', () => {
    for (let room of Object.keys(subscriptions)) {
      ws.emit('subscribe', room)
    }
  })
}
