export function getParentsConstructors (object) {
  if (typeof object !== 'object') throw new TypeError('first argument must be an object')
  const constructors = []
  let _proto = object
  do {
    _proto = Reflect.getPrototypeOf(_proto)
    _proto && constructors.push(_proto)
  } while (_proto)
  return constructors
}

export function getParentsConstructorsNames (object) {
  return getParentsConstructors(object).map(constructor => constructor.name)
}

/**
 * Tells if an object is an instance of the given class name (from any window instance).
 * @param {object} object any object to test
 * @param {string} className the class name to check
 * @returns {boolean} true if the object is an instance of the given class name
 */
export function isInstanceOf (object, className) {
  let rv = false
  getParentsConstructorsNames(object).forEach(constructorName => {
    if (constructorName === className) rv = true
  })
  return rv
}
