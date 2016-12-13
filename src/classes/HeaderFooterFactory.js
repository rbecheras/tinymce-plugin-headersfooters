'use strict'

var Header = require('./Header')
var Footer = require('./Footer')
var Body = require('./Body')

var units = require('../utils/units')

var $ = window.jQuery
var getComputedStyle = window.getComputedStyle

module.exports = HeaderFooterFactory

HeaderFooterFactory.prototype = {
  resetLastActiveSection: resetLastActiveSection,
  updateLastActiveSection: updateLastActiveSection,
  loadElement: loadElement,
  insertHeader: insertHeader,
  insertBody: insertBody,
  insertFooter: insertFooter,
  removeHeader: removeHeader,
  removeFooter: removeFooter,
  hasHeader: hasHeader,
  hasBody: hasBody,
  hasFooter: hasFooter,
  focusToEndOfBody: focusToEndOfBody,
  forceCursorToAllowedLocation: forceCursorToAllowedLocation,
  getActiveSection: getActiveSection,
  reload: reload,
  forceBodyMinHeigh: forceBodyMinHeigh,
  removeAnyOuterElement: removeAnyOuterElement
}

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
function HeaderFooterFactory (editor, menuItemsList) {
  this._editor = editor
  this._hasHeader = false
  this._hasBody = false
  this._hasFooter = false
  this._menuItemsList = menuItemsList

  this.resetLastActiveSection()
}

/**
 * Reset the last active section
 * @method
 * @returns {undefined}
 */
function resetLastActiveSection () {
  this.lastActiveSection = null
}

/**
 * Update HeaderFooterFactory#lastActiveSection getting the HeaderFooterFactory#getActiveSection() returned value
 * @method
 * @returns {HeadFoot} the updated last active section
 */
function updateLastActiveSection () {
  this.lastActiveSection = this.getActiveSection()
  return this.lastActiveSection
}

/**
 * Load an existing header or footer depending of its nature, from its DOM element.
 * @method
 * @param {DOMElement} element
 * @throws {Error} when the given element is not a header, footer neither a body element.
 * @returns void
 */
function loadElement (element) {
  var $el = $(element)
  if ($el.attr('data-headfoot-header')) {
    this._hasHeader = true
    this.header = new Header(this._editor, this._editor.getBody(), element)
  } else if ($el.attr('data-headfoot-footer')) {
    this._hasFooter = true
    this.footer = new Footer(this._editor, this._editor.getBody(), element)
  } else if ($el.attr('data-headfoot-body')) {
    this._hasBody = true
    this.body = new Body(this._editor, this._editor.getBody(), element, this.hasHeader(), this.hasFooter(), this.header)
  } else throw new Error('This element is not a header, footer neither a body element.')
}

/**
 * Insert a new header
 * @method
 * @returns void
 */
function insertHeader () {
  this.header = new Header(this._editor, this._editor.getBody())
  this._hasHeader = true
  this.header.enterNode()
}

/**
 * Insert a new body
 * @method
 * @returns void
 */
function insertBody () {
  this.body = new Body(this._editor, this._editor.getBody(), this._hasHeader, this._hasFooter, this.header)
  this._hasBody = true
  this.body.enterNode()
}

/**
 * Insert a new footer
 * @method
 * @returns void
 */
function insertFooter () {
  this.footer = new Footer(this._editor, this._editor.getBody())
  this._hasFooter = true
  this.footer.enterNode()
}

/**
 * Remove the current header
 * @method
 * @returns void
 */
function removeHeader () {
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
function removeFooter () {
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
function hasHeader () {
  return this._hasHeader
}

/**
 * Check if the document has a body or not
 * @method
 * @returns {Boolean} true if the document has a body, false if not
 */
function hasBody () {
  return this._hasBody
}

/**
 * Check if the document has a footer or not
 * @method
 * @returns {Boolean} true if the document has a footer, false if not
 */
function hasFooter () {
  return this._hasFooter
}

function focusToEndOfBody () {
  var $body = $(this.body.node)
  var lastBodyChild = $body.children().last()[0]
  this.body.enterNode()
  this._editor.selection.setCursorLocation(lastBodyChild, lastBodyChild.childNodes.length)
}

function forceCursorToAllowedLocation (node, parents) {
  if (this.hasBody()) {
    if (!parents) {
      var $node = $(node)
      var allparents = $node.parents()
      parents = allparents.slice(0, -2)
    }

    var lastParent = parents[parents.length - 1]
    var allowedLocations = [this.body.node]

    if (this.hasHeader()) {
      allowedLocations.push(this.header.node)
    }
    if (this.hasFooter()) {
      allowedLocations.push(this.footer.node)
    }

    if (!~allowedLocations.indexOf(lastParent) && !~allowedLocations.indexOf(node)) {
      this.focusToEndOfBody()
    }
  }
}

function getActiveSection () {
  return [this.header, this.body, this.footer]
  .reduce(function (prev, section) {
    if (prev) {
      return prev
    } else {
      if (section && section.isActive) {
        return section
      }
    }
  }, null)
}

/**
 * Helper function. Do the reload of headers and footers
 * @method
 * @returns {undefined}
 */
function reload () {
  var that = this
  var editor = this._editor
  var $headFootElmts = $('*[data-headfoot]', editor.getDoc())
  var $bodyElmt = $('*[data-headfoot-body]', editor.getDoc())
  var hasBody = !!$bodyElmt.length
  var $allElmts = null

  // init starting states
  this._menuItemsList.insertHeader.show()
  this._menuItemsList.insertFooter.show()
  this._menuItemsList.removeHeader.hide()
  this._menuItemsList.removeFooter.hide()

  // set another state and load elements if a header or a footer exists
  $headFootElmts.each(function (i, el) {
    var $el = $(el)

    // Configure menu items
    if ($el.attr('data-headfoot-header')) {
      that._menuItemsList.insertHeader.hide()
      that._menuItemsList.removeHeader.show()
    } else if ($el.attr('data-headfoot-body')) {
      // @TODO something ?
    } else if ($el.attr('data-headfoot-footer')) {
      that._menuItemsList.insertFooter.hide()
      that._menuItemsList.removeFooter.show()
    }

    try {
      // Configure the headfoot DOM section
      that.loadElement(el)
    } catch (e) {
      console.error('headerFooterFactory reloading failed for the following element.')
      console.log('Failed element (continuing...):', el)
    }
  })

  // Create the body section if it doesn't exist yet
  // and populate it with the previous body tag children elements
  if (!hasBody) {
    $allElmts = $(editor.getBody()).children()
    that.insertBody()
    var $body = $(that.body.node)
    $body.empty()
    $allElmts.each(function (i, el) {
      var $el = $(el)
      if (!$el.attr('data-headfoot')) {
        $body.append($el)
      }
    })
  }
  // editor.fire('SetContent', {set: true})
}

/**
 * Make sure the body minimum height is correct, depending the margins, header and footer height.
 * NodeChange event handler.
 * @function
 * @inner
 * @returns void
 */
function forceBodyMinHeigh () {
  var bodyTag = {}
  var bodySection = {}
  var headerSection = {}
  var footerSection = {}
  var pageHeight

  bodySection.node = this.body.node
  bodySection.height = this.body.node.offsetHeight
  bodySection.style = window.getComputedStyle(bodySection.node)

  if (this.hasHeader()) {
    headerSection.node = this.header.node
    headerSection.height = this.header.node.offsetHeight
    headerSection.style = window.getComputedStyle(headerSection.node)
  } else {
    headerSection.node = null
    headerSection.height = 0
    headerSection.style = window.getComputedStyle(document.createElement('bogusElement'))
  }

  if (this.hasFooter()) {
    footerSection.node = this.footer.node
    footerSection.height = this.footer.node.offsetHeight
    footerSection.style = window.getComputedStyle(footerSection.node)
  } else {
    footerSection.node = null
    footerSection.height = 0
    footerSection.style = window.getComputedStyle(document.createElement('bogusElement'))
  }

  bodyTag.node = this._editor.getBody()
  bodyTag.height = units.getValueFromStyle(getComputedStyle(this._editor.getBody()).minHeight)
  bodyTag.style = getComputedStyle(bodyTag.node)
  bodyTag.paddingTop = units.getValueFromStyle(bodyTag.style.paddingTop)
  bodyTag.paddingBottom = units.getValueFromStyle(bodyTag.style.paddingBottom)

  pageHeight = bodyTag.height - bodyTag.paddingTop - bodyTag.paddingBottom - headerSection.height - footerSection.height
  $(bodySection.node).css({ minHeight: pageHeight })
}

/**
 * Remove any element located out of the allowed sections.
 * @method
 * @returns void
 */
function removeAnyOuterElement () {
  var that = this
  var $body = $(this._editor.getBody())
  $body.children().each(function (i) {
    var allowedRootNodes = [that.body.node]
    if (that.hasHeader()) {
      allowedRootNodes.push(that.header.node)
    }
    if (that.hasFooter()) {
      allowedRootNodes.push(that.footer.node)
    }
    if (!~allowedRootNodes.indexOf(this) && !this.getAttribute('data-mce-bogus')) {
      console.error('Removing the following element because it is out of the allowed sections')
      console.log('Removed element:', this)
      $(this).remove()
    }
  })
}
