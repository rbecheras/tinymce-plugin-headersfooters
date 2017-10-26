'use strict'

export default class NotImplementedError extends Error {
  constructor (functionName) {
    super()
    this.name = 'NotImplementedError'
    this.message = this.name.concat(': ', functionName, '() is not yet implemented')
    let stackArray = this.stack.split('\n')
    stackArray.splice(1, 1)
    this.stack = stackArray.join('\n')
  }
}
