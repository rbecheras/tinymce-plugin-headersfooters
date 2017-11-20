/**
 * This static class exports utilities to do object reflection.
 * @static
 */
export default class ReflectionUtils {
  /**
   * Get the parents constructors of a given object
   * @param {*} object The given object
   * @example
   * let n = $('p')[0]
   * getParentsConstructors(n)
   * // => result:
   * //(6) [ƒ, ƒ, ƒ, ƒ, ƒ, ƒ]
   * // > 0:ƒ HTMLParagraphElement()
   * // > 1:ƒ HTMLElement()
   * // > 2:ƒ Element()
   * // > 3:ƒ Node()
   * // > 4:ƒ EventTarget()
   * // > 5:ƒ Object()
   * // > length:6
   * // > __proto__:Array(0)
   */
  static getParentsConstructors (object) {
    if (typeof object !== 'object') throw new TypeError('first argument must be an object')
    const constructors = []
    let _proto = object
    do {
      _proto = Reflect.getPrototypeOf(_proto)
      _proto && constructors.push(_proto.constructor)
    } while (_proto)
    return constructors
  }

  /**
   * Get the parents constructors names of a given object
   * @param {*} object The given object
   * @example
   * let n = $('p')[0]
   * getParentsConstructors(n)
   * // => result:
   * //(6) [ƒ, ƒ, ƒ, ƒ, ƒ, ƒ]
   * // > 0:ƒ HTMLParagraphElement()
   * // > 1:ƒ HTMLElement()
   * // > 2:ƒ Element()
   * // > 3:ƒ Node()
   * // > 4:ƒ EventTarget()
   * // > 5:ƒ Object()
   * // > length:6
   * // > __proto__:Array(0)
   */
  static getParentsConstructorsNames (object) {
    return ReflectionUtils.getParentsConstructors(object).map(constructor => constructor.name)
  }

  /**
   * Tells if an object is an instance of the given class name (from any window instance).
   * @param {object} object any object to test
   * @param {string} className the class name to check
   * @returns {boolean} true if the object is an instance of the given class name
   * @example
   * let n = $('p')[0]
   * getParentsConstructorsNames(n)
   * // => result:
   * // (6) []
   * // > 0:"HTMLParagraphElement"
   * // > 1:"HTMLElement"
   * // > 2:"Element"
   * // > 3:"Node"
   * // > 4:"EventTarget"
   * // > 5:"Object"
   * // > length:6
   * // > __proto__:Array(0)
   */
  static isInstanceOf (object, className) {
    let rv = false
    ReflectionUtils.getParentsConstructorsNames(object).forEach(constructorName => {
      if (constructorName === className) rv = true
    })
    return rv
  }
}
