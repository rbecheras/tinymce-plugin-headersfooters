'use strict'

// var ui = require('../utils/ui')
// var domUtils = require('../utils/dom')

var $ = window.jQuery
var tinymce = window.tinymce

module.exports = HeadFoot

// Public API
HeadFoot.prototype = {
  setPlaceholder: setPlaceholder,
  initParagraph: initParagraph,
  pristine: pristine
}

/**
 * Abstract class to inherit Header and Footer sub classes from.
 * @constructor
 * @abstract
 * @param {Editor} editor The current editor
 */
function HeadFoot (editor, nodeElement) {
  this.node = nodeElement
}

function setPlaceholder () {
  var translatedLabel = tinymce.i18n.translate('Double-click to edit this content')
  var $p = this.initParagraph().html(translatedLabel)
  $(this.node).append($p)
  this.pristine(true)
}

function initParagraph () {
  var $span = $('<span>').css({ 'font-family': 'calibri', 'font-size': '12pt' })
  var $p = $('<p>').append($span)
  $span.html('<br data-mce-bogus="1">')
  $(this.node).removeAttr('data-headfoot-pristine').empty().append($p)
  return $p
}

/**
 * [Getter/Setter] Get or set the pristine state of the headfoot node
 * @method
 * @param {Boolean} [b] If defined, the value to set
 * @returns {Boolean|undefined} - The pristine value if no argument is given.
 * @throws {Error} - if this.node is unset an error is thrown
 */
function pristine (b) {
  if (!this.node || !this.node.nodeType) {
    throw new Error('Missing node can not be pristine or not.')
  }
  var attr = 'data-headfoot-pristine'
  if (b === undefined) {
    return this.node.getAttribute(attr) === 'true'
  } else {
    this.node.setAttribute(attr, !!b)
  }
}
