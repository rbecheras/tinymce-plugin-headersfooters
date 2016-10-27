'use strict'

var Header = require('./Header')
var Footer = require('./Footer')
var Body = require('./Body')

var $ = window.jQuery

module.exports = HeaderFooterFactory

/**
 * HeaderFactory class. The aim of this class is to manage the document header and footer.
 * @constructor
 * @param {Editor} editor The current editor
 * @property {Editor} _editor The current editor
 * @property {Boolean} _hasHeader Tell if the document has a header or not
 * @property {Boolean} _hasBody Tell if the document has a body or not
 * @property {Boolean} _hasFooter Tell if the document has a fooer or not
 * @property {Header} header The current header if exists
 * @property {Footer} footer The current footer if exists
 */
function HeaderFooterFactory (editor) {
  this._editor = editor
  this._hasHeader = false
  this._hasBody = false
  this._hasFooter = false
}

/**
 * Load an existing header or footer depending of its nature, from its DOM element.
 * @method
 * @param {DOMElement} element
 * @returns void
 */
HeaderFooterFactory.prototype.loadElement = function (element) {
  var $el = $(element)
  if ($el.attr('data-headfoot-header')) {
    this._hasHeader = true
    this.header = new Header(this._editor, this._editor.getBody(), element)
  } else if ($el.attr('data-headfoot-footer')) {
    this._hasFooter = true
    this.footer = new Footer(this._editor, this._editor.getBody(), element)
  } else if ($el.attr('data-headfoot-body')) {
    this._hasBody = true
    this.body = new Body(this._editor, this._editor.getBody(), element)
  } else throw new Error('This element is not a header, footer neither a body element.')
}

/**
 * Insert a new header
 * @method
 * @returns void
 */
HeaderFooterFactory.prototype.insertHeader = function () {
  this.header = new Header(this._editor, this._editor.getBody())
  this._hasHeader = true
}

/**
 * Insert a new body
 * @method
 * @returns void
 */
HeaderFooterFactory.prototype.insertBody = function () {
  this.body = new Body(this._editor, this._editor.getBody(), this._hasHeader, this._hasFooter, this.header)
  this._hasBody = true
}

/**
 * Insert a new footer
 * @method
 * @returns void
 */
HeaderFooterFactory.prototype.insertFooter = function () {
  this.footer = new Footer(this._editor, this._editor.getBody())
  this._hasFooter = true
}

/**
 * Remove the current header
 * @method
 * @returns void
 */
HeaderFooterFactory.prototype.removeHeader = function () {
  // the header can be removed only if it exists
  if (!this.hasHeader()) throw new Error('No header available to remove')

  $(this.header.node).remove()
  this.header = null
  this._hasHeader = false
}

/**
 * Insert a new footer
 * @method
 * @returns void
 */
HeaderFooterFactory.prototype.removeFooter = function () {
  // the footer can be removed only if it exists
  if (!this.hasFooter()) throw new Error('No footer available to remove')

  $(this.footer.node).remove()
  this.footer = null
  this._hasFooter = false
}

/**
 * Check if the document has a header or not
 * @method
 * @returns {Boolean} true if the document has a header, false if not
 */
HeaderFooterFactory.prototype.hasHeader = function () {
  return this._hasHeader
}

/**
 * Check if the document has a body or not
 * @method
 * @returns {Boolean} true if the document has a body, false if not
 */
HeaderFooterFactory.prototype.hasBody = function () {
  return this._hasBody
}

/**
 * Check if the document has a footer or not
 * @method
 * @returns {Boolean} true if the document has a footer, false if not
 */
HeaderFooterFactory.prototype.hasFooter = function () {
  return this._hasFooter
}

HeaderFooterFactory.prototype.focusToEndOfBody = function () {
  var $body = $(this.body.node)
  var lastBodyChild = $body.children().last()[0]
  this.body.enterNode()
  this._editor.selection.setCursorLocation(lastBodyChild, lastBodyChild.childNodes.length)
}
