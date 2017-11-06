/**
 * This static class exports utilities to do object reflection.
 * @static
 */
export default class ReflectionUtils {
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

  static getParentsConstructorsNames (object) {
    return ReflectionUtils.getParentsConstructors(object).map(constructor => constructor.name)
  }

  /**
   * Tells if an object is an instance of the given class name (from any window instance).
   * @param {object} object any object to test
   * @param {string} className the class name to check
   * @returns {boolean} true if the object is an instance of the given class name
   */
  static isInstanceOf (object, className) {
    let rv = false
    ReflectionUtils.getParentsConstructorsNames(object).forEach(constructorName => {
      if (constructorName === className) rv = true
    })
    return rv
  }
}
