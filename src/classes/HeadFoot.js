'use strict'

var ui = require('../utils/ui')

var $ = window.jQuery
var tinymce = window.tinymce

module.exports = HeadFoot

/**
 * Abstract class to inherit Header and Footer sub classes from.
 * @constructor
 * @param {Editor} editor The current editor
 * @param {DOMElement} documentBody The document body for this documentBody
 * @param {DOMNode} [existingElement] The optional existing element that constitute a header of a footer and should be loaded from it
 * @property {Editor} _editor The current editor
 * @property {DOMElement}  _documentBody The body element of the current document
 * @property {DOMNode} node The header/footer's node element
 */
function HeadFoot (editor, documentBody, existingElement) {
  // bind useful vars
  var that = this
  this._editor = editor
  this._documentBody = documentBody
  this.pluginPaginate = editor.plugins.paginate

  // load the existing element if it exists or create a new one.
  if (existingElement) {
    this.node = existingElement
  } else {
    this._createNode()
  }

  var $thisNode = $(this.node)
  // live the node and implements the double click handler to switch the contentEditable mode.
  this.isActive = false
  this.liveNode()
  $thisNode.dblclick(this.enterNode.bind(this))
  $(this._documentBody).on('EnterNode', function (evt) {
    if (that.node !== evt.target) {
      that.liveNode()
    }
  })
}

/**
 * Create a new node for an header or a footer.
 * @private
 * @method
 */
HeadFoot.prototype._createNode = function () {
  this.node = $('<section>')
  .attr('data-headfoot', true)
  .attr('data-headfoot-pristine', true)[0]
  this.setPlaceholder()
}

/**
 * Disable the page edition and enable the edition for the header or the footers
 * @method
 * @returns void
 */
HeadFoot.prototype.enterNode = function () {
  if (!this.isActive) {
    var that = this
    var headfootContent
    var currentPageContent
    var $thisNode = $(this.node)

    this.isActive = true
    $thisNode.trigger('EnterNode', this.node)

    // disable paginator watching
    if (this.pluginPaginate) {
      this.pluginPaginate.disableWatchPage()

      // toggle elements states (contentEditable or not)
      $.each(this.pluginPaginate.paginator.getPages(), function () {
        ui.lockNode.call(this)
      })
    }

    ui.unlockNode.call(this.node)

    // select the unlocked node content or not
    headfootContent = this.node.firstChild
    if (!headfootContent) {
      throw new Error('no child is not allowed in a headfoot')
    }
    this._editor.selection.select(headfootContent)
    this._editor.selection.collapse(true)
    if ($thisNode.attr('data-headfoot-pristine')) {
      $thisNode.removeAttr('data-headfoot-pristine')
    }

    if (this.pluginPaginate) {
      // bind a click handler to the current page to toggle contentEditable state between header/footer and the page
      currentPageContent = this.pluginPaginate.getCurrentPage().content()
      $(currentPageContent).click(that.liveNode.bind(that))
    }
  }
}

/**
 * Do the inverse of .enterNode(). Disable edition for the header or footer, and re-enable it for the current page.
 * @method
 * @returns void
 */
HeadFoot.prototype.liveNode = function () {
  this.isActive = false
  $(this.node).trigger('LiveNode', this.node)
  if (this.pluginPaginate) {
    this.pluginPaginate.enableWatchPage()
    $.each(this.pluginPaginate.paginator.getPages(), function () {
      ui.unlockNode.call(this)
    })
  }
  // var sectionChildNodes = this.node.childNodes
  // if (sectionChildNodes) {
  //   if (
  //     !sectionChildNodes.length ||
  //     sectionChildNodes.length === 1 && !sectionChildNodes.item(0).childNodes.length ||
  //     sectionChildNodes.length === 1 && sectionChildNodes.item(0).childNodes.length === 1 && sectionChildNodes.item(0).childNodes.item(0) === 'BR'
  //   ) {
  //     this.setPlaceholder()
  //   }
  // } else {
  //   this.setPlaceholder()
  // }
  ui.lockNode.call(this.node)
}

HeadFoot.prototype.setPlaceholder = function () {
  var $placeholderSpan = $('<span>').css({ 'font-family': 'calibri', 'font-size': '12pt' })
  var $placeholder = $('<p>').append($placeholderSpan)
  var translatedLabel = tinymce.i18n.translate('Double-click to edit this content')
  $placeholderSpan.html(translatedLabel)
  $(this.node).empty().append($placeholder)
}
