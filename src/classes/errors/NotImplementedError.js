'use strict'

module.exports = NotImplementedError

NotImplementedError.prototype = Object.create(Error.prototype)

function NotImplementedError (functionName) {
  var message = this.name.concat(': ', functionName, '() is not yet implemented')
  Error.prototype.constructor.call(this, this.message)
  this.name = 'NotImplementedError'
  this.message = message
  console.log('NotImplementedError stack trace (1): ', this.stack)
  this.stack = new Error().stack
  console.log('NotImplementedError stack trace (2): ', this.stack)
  console.log('Debugging NotImplementedError:')
  console.debug(this)
}
