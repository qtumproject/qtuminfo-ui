// class ExtendableError extends Error {
class ExtendableError {
  constructor(message) {
    // super()
    this.message = message
    this.stack = new Error().stack
    this.name = this.constructor.name
  }
}

export {ExtendableError}
