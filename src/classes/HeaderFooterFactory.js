'use strict'

// var Header = require('./Header')
// var Footer = require('./Footer')
// var Body = require('./Body')
var NotImplementedError = require('./errors/NotImplementedError')

// var units = require('../utils/units')

// var $ = window.jQuery
// var getComputedStyle = window.getComputedStyle

module.exports = HeaderFooterFactory

HeaderFooterFactory.prototype = {
  hasHeader: hasHeader,
  hasFooter: hasFooter,
  focusToEndOfBody: focusToEndOfBody,
  reload: reload,
  forceBodyMinHeigh: forceBodyMinHeigh
}

function HeaderFooterFactory () {
  throw new NotImplementedError(HeaderFooterFactory.prototype.forceBodyMinHeigh)
}

function hasHeader () {
  throw new NotImplementedError(HeaderFooterFactory.prototype.hasHeader)
}

function hasFooter () {
  throw new NotImplementedError(HeaderFooterFactory.prototype.hasFooter)
}

function focusToEndOfBody () {
  throw new NotImplementedError(HeaderFooterFactory.prototype.focusToEndOfBody)
  // var $body = $(this.body.node)
  // var lastBodyChild = $body.children().last()[0]
  // this.body.enterNode()
  // this._editor.selection.setCursorLocation(lastBodyChild, lastBodyChild.childNodes.length)
}

/**
 * Helper function. Do the reload of headers and footers
 * @method
 * @returns {undefined}
 */
function reload () {
  throw new NotImplementedError(HeaderFooterFactory.prototype.reload)
  // init starting states
  // this._menuItemsList.insertHeader.show()
  // this._menuItemsList.insertFooter.show()
  // this._menuItemsList.removeHeader.hide()
  // this._menuItemsList.removeFooter.hide()
}

/**
 * Make sure the body minimum height is correct, depending the margins, header and footer height.
 * NodeChange event handler.
 * @function
 * @inner
 * @returns void
 */
function forceBodyMinHeigh () {
  throw new NotImplementedError(HeaderFooterFactory.prototype.forceBodyMinHeigh)
  // var bodyTag = {}
  // var bodySection = {}
  // var headerSection = {}
  // var footerSection = {}
  // var pageHeight
  //
  // bodySection.node = this.body.node
  // bodySection.height = this.body.node.offsetHeight
  // bodySection.style = window.getComputedStyle(bodySection.node)
  //
  // if (this.hasHeader()) {
  //   headerSection.node = this.header.node
  //   headerSection.height = this.header.node.offsetHeight
  //   headerSection.style = window.getComputedStyle(headerSection.node)
  // } else {
  //   headerSection.node = null
  //   headerSection.height = 0
  //   headerSection.style = window.getComputedStyle(document.createElement('bogusElement'))
  // }
  //
  // if (this.hasFooter()) {
  //   footerSection.node = this.footer.node
  //   footerSection.height = this.footer.node.offsetHeight
  //   footerSection.style = window.getComputedStyle(footerSection.node)
  // } else {
  //   footerSection.node = null
  //   footerSection.height = 0
  //   footerSection.style = window.getComputedStyle(document.createElement('bogusElement'))
  // }
  //
  // bodyTag.node = this._editor.getBody()
  // bodyTag.height = units.getValueFromStyle(getComputedStyle(this._editor.getBody()).minHeight)
  // bodyTag.style = getComputedStyle(bodyTag.node)
  // bodyTag.paddingTop = units.getValueFromStyle(bodyTag.style.paddingTop)
  // bodyTag.paddingBottom = units.getValueFromStyle(bodyTag.style.paddingBottom)
  //
  // pageHeight = bodyTag.height - bodyTag.paddingTop - bodyTag.paddingBottom - headerSection.height - footerSection.height
  // $(bodySection.node).css({ minHeight: pageHeight })
}
