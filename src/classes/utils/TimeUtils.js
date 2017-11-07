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
}
