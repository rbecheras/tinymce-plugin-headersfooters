'use strict'

/**
 * A set of static helper methods to work with units.
 * It is imported from tinymce-plugin-paragraph.
 * @module utils/units
 * @see https://github.com/sirap-group/tinymce-plugin-paragraph
 * @see https://github.com/sirap-group/tinymce-plugin-paragraph/blob/master/src/lib/units.js
 */

var document = window.document

createDpiTestElements()

module.exports = {
  getValueFromStyle: getValueFromStyle,
  getUnitFromStyle: getUnitFromStyle,
  px2pt: px2pt,
  px2in: px2in,
  in2pt: in2pt,
  getDpi: getDpi
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
 * Converts pixels (px) to points (pt)
 * px -> in -> pt
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
 * Converts pixels (px) to inches (in)
 * dpi = px / in -> in = px / dpi
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
function createDpiTestElements () {
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
