'use strict'

/**
 * This static class exports utilities to handle date and time.
 * @static
 */
export default class TimeUtils {
  /**
   * Get the current unix timestamp
   * @returns {Number}
   * @example
   * console.log(timestamp())
   * //=> 1510066155158
   */
  static timestamp () {
    return Date.now()
  }

  /**
   * An async helper function that wait for a given time
   * @param {Number} time The time to wait in miliseconds (ms)
   * @param {boolean|string} logMessage True to log "wait for Xs", false to not log anything, and a given string to log and concat the given string to the initial log.
   * @return {Promise} A promise resolved in the given time
   */
  static async waitFor (time, logMessage) {
    if (typeof time !== 'number') throw new TypeError('first argument must be a number')
    return new Promise(resolve => {
      if (logMessage) {
        console.log(`Wait for ${Number(time) / 1000}s ` + logMessage)
      }
      setTimeout(() => resolve(), time)
    })
  }
}
