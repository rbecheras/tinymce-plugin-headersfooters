'use strict'

/**
 * A set of static helper methods to work with units.
 * It is imported from tinymce-plugin-paragraph.
 * @module utils/units
 * @see https://github.com/sirap-group/tinymce-plugin-paragraph
 * @see https://github.com/sirap-group/tinymce-plugin-paragraph/blob/master/src/lib/units.js
 */

const document = window.document

createDpiTestElements()

// expose the module to the global scope in development environment
if (window.env === 'development' && !window._units) {
  window._units = {}
}

/**
 * Get the numerc value of a style value with unit (remove the 2-digits unit and cast as number)
 * For example, returns `11` from a style value of `11px`
 * @param {string} styleValue A style value with a 2-digits unit
 * @returns {number} - The absolute value of the given style value
 */
export function getValueFromStyle (styleValue) {
  return styleValue.slice(0, styleValue.length - 2)
}

/**
 * Get the 2-digit unit representation of a style value with unit.
 * For example, returns `px` from a style value of `11px`
 * @param {string} styleValue A style value with a 2-digits unit
 * @returns {string} - The unit as a 2-digits representation
 */
export function getUnitFromStyle (styleValue) {
  return styleValue.slice(styleValue.length - 2, styleValue.length)
}

/**
 * Evaluate the DPI of the device's screen (pixels per inche).
 * It creates and inpect a dedicated and hidden `data-dpi-test` DOM element to
 * deduct the screen DPI.
 * @returns {number} - The current screen DPI, so in pixels per inch.
 */
export function getDpi () {
  return document.getElementById('dpi-test').offsetHeight
}

export function createDpiTestElements () {
  const getDpiHtmlStyle = 'data-dpi-test { height: 1in; left: -100%; position: absolute; top: -100%; width: 1in; }'

  let head = document.getElementsByTagName('head')[0]
  let getDPIElement = document.createElement('style')
  getDPIElement.setAttribute('type', 'text/css')
  getDPIElement.setAttribute('rel', 'stylesheet')
  getDPIElement.innerHTML = getDpiHtmlStyle
  head.appendChild(getDPIElement)

  let body = document.getElementsByTagName('body')[0]
  let dpiTestElement = document.createElement('data-dpi-test')
  dpiTestElement.setAttribute('id', 'dpi-test')
  body.appendChild(dpiTestElement)
}

/**
 * Converts a quantity of inches to a quantity of milimeters
 * 1 in = 25.4 mm
 * @param {Number} qIn The quantity of inches to convert to milimeters
 * @returns {Number} qMm The resulting length in milimeters
 */
export function in2mm (qIn) {
  return Number(qIn) * 25.4
}

/**
 * Converts milimeters (mm) to inches (in)
 * 1 in = 25.4 mm
 * @param {number} qmm Number of milimeters to convert to inches
 * @returns {number} - Resulting number of inches (in)
 */
export function mm2in (qmm) {
  return Number(qmm) / 25.4
}

/**
 * Converts pixels (px) to inches (in)
 * dpi = px / in
 * => in = px / dpi
 * @param {number} px Number of pixels to convert to inches
 * @returns {number} - Resulting number of inches (in)
 */
export function px2in (px) {
  var dpi = getDpi()
  return Number(px) / Number(dpi)
}

/**
 * Converts pixels (px) to inches (in)
 * dpi = px / in
 * => px = in * dpi
 * @method
 * @static
 * @param {number} qin Number of inches to convert to pixels
 * @returns {number} - Resulting number of pixels (px)
 */
export function in2px (qin) {
  var dpi = getDpi()
  return Number(qin) * Number(dpi)
}

/**
 * Converts a quantity of pixels to a quantity of milimeters
 * 1 in = 25.4 mm
 * Calculate pixels to inches then inches to milimeters
 * @param {Number} qPx The quantity of pixels to convert to milimeters
 * @returns {Number} qMm The resuluting quantity of milimeters
 */
export function px2mm (qPx) {
  return in2mm(px2in(qPx))
}

/**
 * Converts milimeters (mm) to pixels (px)
 * mm2in -> in2px
 * @param {number} qmm Number of milimeters to convert to pixels
 * @returns {number} - Resulting number of pixels (px)
 */
export function mm2px (qmm) {
  return in2px(mm2in(qmm))
}

/**
 * Converts inches (in) to points (pt)
 * 72 = pt / in -> pt = 72 * in
 * @param {number} qinches Number of inches (in) to convet to points (pt)
 * @returns {number} - Resulting number of points (pt)
 */
export function in2pt (qinches) {
  return Number(qinches) * 72
}

/**
 * Converts point (pt) to inches (in)
 * 72 = pt / in -> in = pt / 72
 * @method
 * @static
 * @param {number} qpt Number of inches (in) to convet to points (pt)
 * @returns {number} - Resulting number of points (pt)
 */
export function pt2in (qpt) {
  return qpt / 72
}

/**
 * Converts pixels (px) to points (pt)
 * px2in -> in2pt
 * @param {number} qpx Number of pixels to convert to points
 * @returns {number} - Resulting number of points (pt)
 */
export function px2pt (qpx) {
  var inches = px2in(qpx)
  return in2pt(inches)
}

/**
 * Converts point (pt) to pixels (px)
 * pt2in -> in2px
 * @param {number} qpt Number of points to convert to pixels
 * @returns {number} - Resulting number of pixels (px)
 */
export function pt2px (qpt) {
  return in2px(pt2in(qpt))
}

/**
 * Converts centimeters (cm) to milimeters (mm)
 * qmm = qcm*10
 * @param {number} qcm Number of centimeters to convert to milimeters
 * @returns {number} - Resulting number of milimeters (mm)
 */
export function cm2mm (qcm) {
  return Number(qcm) * 10
}

/**
 * Converts milimeters (mm) to centimeters (cm)
 * qcm = qmm/10
 * @param {number} qmm Number of milimeters to convert to centimeters
 * @returns {number} - Resulting number of centimeters (cm)
 */
export function mm2cm (qmm) {
  return Number(qmm) / 10
}

/**
 * Converts any value with unit to a quantity of pixels (value without unit in output)
 * @example
 * - Xmm -> Y(px)
 * - Xpt -> Y(px)
 * - Xin -> Y(px)
 * - Xpx -> X(px)
 * - Xcm -> Y(px)
 * @param {String} valueWithUnit ex: "3mm", "6in", "12pt"
 * @throws {Error}
 * @returns {Number} the resulting number of pixels (a number, thus without the 'px' unit suffix)
 */
export function getValueInPxFromAnyUnit (valueWithUnit) {
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
    case '0':
    case 0:
      valueInPx = 0
      break
    default:
      throw new Error('InvalidUnitError')
  }
  return valueInPx
}
