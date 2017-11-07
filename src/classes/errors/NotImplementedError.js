'use strict'

/**
 * An error thrown when a not implemented method/function is called
 */
export default class NotImplementedError extends Error {
  /**
   * @param {String} functionName The name of the function that is not implemented
   */
  constructor (functionName) {
    super()

    /**
     * The error name
     * @type {String}
     */
    this.name = 'NotImplementedError'

    /**
     * The error message
     * @type {String}
     */
    this.message = functionName
      ? this.name.concat(': ', functionName, '() is not yet implemented')
      : this.name.concat(': This method is not yet implemented')

    let stackArray = this.stack.split('\n')
    stackArray.splice(1, 1)
    /**
     * The stack trace
     * @type {String}
     */
    this.stack = stackArray.join('\n')
  }
}
