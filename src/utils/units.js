'use strict'

/**
 * A set of static helper methods to work with units.
 * It is imported from tinymce-plugin-paragraph.
 * @module utils/units
 * @see https://github.com/sirap-group/tinymce-plugin-paragraph
 * @see https://github.com/sirap-group/tinymce-plugin-paragraph/blob/master/src/lib/units.js
 */

var document = window.document

_createDpiTestElements()

module.exports = {
  getValueFromStyle: getValueFromStyle,
  getUnitFromStyle: getUnitFromStyle,
  getValueInPxFromAnyUnit: getValueInPxFromAnyUnit,
  getDpi: getDpi,

  in2mm: in2mm,
  mm2in: mm2in,

  px2in: px2in,
  in2px: in2px,

  px2mm: px2mm,
  mm2px: mm2px,

  in2pt: in2pt,
  pt2in: pt2in,

  px2pt: px2pt,
  pt2px: pt2px,

  cm2mm: cm2mm,
  mm2cm: mm2cm
}

// expose the module to the global scope in development environment
if (window.env === 'development' && !window._units) {
  window._units = module.exports
}

/**
 * Get the numerc value of a style value with unit (remove the 2-digits unit and cast as number)
 * For example, returns `11` from a style value of `11px`
 * @method
 * @static
 * @param {string} styleValue A style value with a 2-digits unit
 * @returns {number} - The absolute value of the given style value
 */
function getValueFromStyle (styleValue) {
  return styleValue.slice(0, styleValue.length - 2)
}

/**
 * Get the 2-digit unit representation of a style value with unit.
 * For example, returns `px` from a style value of `11px`
 * @method
 * @static
 * @param {string} styleValue A style value with a 2-digits unit
 * @returns {string} - The unit as a 2-digits representation
 */
function getUnitFromStyle (styleValue) {
  return styleValue.slice(styleValue.length - 2, styleValue.length)
}

/**
* Evaluate the DPI of the device's screen (pixels per inche).
* It creates and inpect a dedicated and hidden `data-dpi-test` DOM element to
* deduct the screen DPI.
* @method
* @static
* @returns {number} - The current screen DPI, so in pixels per inch.
*/
function getDpi () {
  return document.getElementById('dpi-test').offsetHeight
}

/**
* @function
* @inner
*/
function _createDpiTestElements () {
  var getDpiHtmlStyle = 'data-dpi-test { height: 1in; left: -100%; position: absolute; top: -100%; width: 1in; }'

  var head = document.getElementsByTagName('head')[0]
  var getDPIElement = document.createElement('style')
  getDPIElement.setAttribute('type', 'text/css')
  getDPIElement.setAttribute('rel', 'stylesheet')
  getDPIElement.innerHTML = getDpiHtmlStyle
  head.appendChild(getDPIElement)

  var body = document.getElementsByTagName('body')[0]
  var dpiTestElement = document.createElement('data-dpi-test')
  dpiTestElement.setAttribute('id', 'dpi-test')
  body.appendChild(dpiTestElement)
}

/**
 * Converts a quantity of inches to a quantity of milimeters
 * 1 in = 25.4 mm
 * @method
 * @static
 * @param {Number} qPx The quantity of inches to convert to milimeters
 * @returns {Number} qMm The resulting length in milimeters
 */
function in2mm (qIn) {
  return Number(qIn) * 25.4
}

/**
 * Converts milimeters (mm) to inches (in)
 * 1 in = 25.4 mm
 * @method
 * @static
 * @param {number} mm Number of milimeters to convert to inches
 * @returns {number} - Resulting number of inches (in)
 */
function mm2in (qmm) {
  return Number(qmm) / 25.4
}

/**
* Converts pixels (px) to inches (in)
* dpi = px / in
* => in = px / dpi
* @method
* @static
* @param {number} px Number of pixels to convert to inches
* @returns {number} - Resulting number of inches (in)
*/
function px2in (px) {
  var dpi = getDpi()
  return Number(px) / Number(dpi)
}

/**
* Converts pixels (px) to inches (in)
* dpi = px / in
* => px = in * dpi
* @method
* @static
* @param {number} in Number of inches to convert to pixels
* @returns {number} - Resulting number of pixels (px)
*/
function in2px (qin) {
  var dpi = getDpi()
  return Number(qin) * Number(dpi)
}

/**
* Converts a quantity of pixels to a quantity of milimeters
* 1 in = 25.4 mm
* Calculate pixels to inches then inches to milimeters
* @method
* @static
* @param {Number} qPx The quantity of pixels to convert to milimeters
* @returns {Number} qMm The resuluting quantity of milimeters
*/
function px2mm (qPx) {
  return in2mm(px2in(qPx))
}

/**
 * Converts milimeters (mm) to pixels (px)
 * mm2in -> in2px
 * @method
 * @static
 * @param {number} qmm Number of milimeters to convert to pixels
 * @returns {number} - Resulting number of pixels (px)
 */
function mm2px (qmm) {
  return in2px(mm2in(qmm))
}

/**
* Converts inches (in) to points (pt)
* 72 = pt / in -> pt = 72 * in
* @method
* @static
* @param {number} inches Number of inches (in) to convet to points (pt)
* @returns {number} - Resulting number of points (pt)
*/
function in2pt (inches) {
  return Number(inches) * 72
}

/**
* Converts point (pt) to inches (in)
* 72 = pt / in -> in = pt / 72
* @method
* @static
* @param {number} inches Number of inches (in) to convet to points (pt)
* @returns {number} - Resulting number of points (pt)
*/
function pt2in (qpt) {
  return qpt / 72
}

/**
 * Converts pixels (px) to points (pt)
 * px2in -> in2pt
 * @method
 * @static
 * @param {number} px Number of pixels to convert to points
 * @returns {number} - Resulting number of points (pt)
 */
function px2pt (px) {
  var inches = px2in(px)
  return in2pt(inches)
}

/**
 * Converts point (pt) to pixels (px)
 * pt2in -> in2px
 * @method
 * @static
 * @param {number} pt Number of points to convert to pixels
 * @returns {number} - Resulting number of pixels (px)
 */
function pt2px (qpt) {
  return in2px(pt2in(qpt))
}

function cm2mm (qcm) {
  return Number(qcm) * 10
}

function mm2cm (qmm) {
  return Number(qmm) / 10
}

/**
 * Converts things like:
 * - Xmm -> Ypx
 * - Xpt -> Ypx
 * - Xin -> Ypx
 * - Xpx -> Xpx
 * - Xcm -> Ypx
 * @static
 * @param {String} valueWithUnit ex: "3mm"
 * @throws Error
 * @returns {Number}
 */
function getValueInPxFromAnyUnit (valueWithUnit) {
  let value = getValueFromStyle(valueWithUnit)
  let unit = getUnitFromStyle(valueWithUnit)
  let valueInPx
  switch (unit) {
    case 'px':
      valueInPx = value
      break
    case 'mm':
      valueInPx = mm2px(value)
      break
    case 'cm':
      valueInPx = mm2px(cm2mm(value))
      break
    case 'pt':
      valueInPx = pt2px(value)
      break
    case 'in':
      valueInPx = in2px(value)
      break
    default:
      throw new Error('InvalidUnitError')
  }
  return valueInPx
}
