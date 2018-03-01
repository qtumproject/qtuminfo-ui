class WS {
  constructor(uri) {
    this._messages = []
    this._eventHandlers = []
    this._threshold = 20000
    this._lastActiveTime = Date.now()
    this._uri = uri
    this._subscriptions = {}
    this._connection = null
    this.connect()
    this._timer = setInterval(() => {
      if ([WebSocket.CLOSING, WebSocket.CLOSED].includes(this._connection.readyState)) {
        this.emit('disconnect')
        this.connect()
      } else if (Date.now() - this._lastActiveTime > this._threshold) {
        this.send('ping')
      }
    }, 10000)
  }

  close() {
    this._connection.close()
  }

  send(message) {
    if (this._connection.readyState !== WebSocket.OPEN) {
      this._messages.push(message)
      this.connect()
    } else {
      this._connection.send(JSON.stringify(message))
      this._lastActiveTime = Date.now()
    }
  }

  receive(event) {
    this._lastActiveTime = Date.now()
    try {
      let message = JSON.parse(event.data)
      if (message === 'pong') {
      } else {
        this.emit(message.type, message.data, message)
      }
    } catch (err) {}
  }

  connect() {
    if (this._connection instanceof WebSocket && this._connection.readyState === WebSocket.CONNECTING) {
      return
    }
    try {
      this._connection = new WebSocket(this._uri)
      this._connection.addEventListener('open', () => {
        this.emit('connect')
        for (let message of this._messages) {
          this._connection.send(JSON.stringify(message))
        }
        this._messages = []
        this._lastActiveTime = Date.now()
        this._connection.addEventListener('message', this.receive.bind(this))
      })
    } catch (err) {}
  }

  on(event, callback) {
    if (!(event in this._eventHandlers)) {
      this._eventHandlers[event] = [callback]
    } else if (!this._eventHandlers[event].includes(callback)) {
      this._eventHandlers[event].push(callback)
    }
  }

  off(event, callback) {
    if (!this._eventHandlers[event]) {
      return
    }
    if (!callback) {
      this._eventHandlers[event] = []
    }
    let index = this._eventHandlers[event].indexOf(callback)
    if (index >= 0) {
      this._eventHandlers[event].splice(index, 1)
    }
  }

  emit(event, data, origin) {
    if (event in this._eventHandlers) {
      for (let callback of this._eventHandlers[event]) {
        callback(data, origin)
      }
    }
  }

  subscribe(event) {
    if (this._subscriptions[event]) {
      ++this._subscriptions[event]
    } else {
      this.send({type: 'subscribe', data: event})
      this._subscriptions[event] = 1
    }
  }

  unsubscribe(event) {
    if (!this._subscriptions[event]) {
      return
    }
    if (--this._subscriptions[event] === 0) {
      this.send({type: 'unsubscribe', data: event})
    }
  }
}

export default WS
