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

/**
 * Tells if an object is a Node instance (from any window instance).
 * If you want to know what is the context window where the Node constructor was used (window.Node), use the function `getNodeWindow(node)`
 * @param {object} object any object to test
 * @returns {boolean} true if the object is a Node instance
 */
export function isInstanceOf (object, className) {
  if (typeof object !== 'object') throw new TypeError('first argument must be an object')
  let rv
  let _proto = object
  do {
    _proto = Reflect.getPrototypeOf(_proto)
    if (_proto && _proto.constructor && _proto.constructor.name) {
      if (_proto.constructor.name === className) {
        rv = true
      }
    }
  } while (_proto)
  return rv
}
