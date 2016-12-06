'use strict'

var $ = window.jQuery
var HEADER_FOOTER_ONLY_SELECTOR = 'section[data-headfoot-header], section[data-headfoot-footer]'

/**
 * User interface module
 * @module
 * @name ui
 * @description A module to provide configured ui elements to the plugin
 */

/**
 * Class MenuItem
 * @var
 * @name MenuItem
 * @type class
 */
var MenuItem = require('../classes/MenuItem')

/**
 * A hash of menu items options
 * @var
 * @name menuItems
 * @type  {object}
 *
 */
module.exports = {
  createInsertHeaderMenuItem: createInsertHeaderMenuItem,
  createRemoveHeaderMenuItem: createRemoveHeaderMenuItem,
  createInsertFooterMenuItem: createInsertFooterMenuItem,
  createRemoveFooterMenuItem: createRemoveFooterMenuItem,
  createInsertPageNumber: createInsertPageNumber,
  createinsertNumberOfPages: createinsertNumberOfPages,
  lockNode: lockNode,
  unlockNode: unlockNode,
  addUnselectableCSSClass: addUnselectableCSSClass
}

/**
 * Create a menu item to insert a header
 * @function
 * @static
 * @returns {MenuItem}
 */
function createInsertHeaderMenuItem () {
  return new MenuItem('insertHeader', {
    text: 'Insérer une entête',
    icon: 'abc',
    id: 'plugin-headersfooters-menuitem-insert-header',
    context: 'insert',
    onclick: function () {
      window.alert('insert header')
    }
  })
}

/**
 * Create a menu item to remove a header
 * @function
 * @static
 * @returns {MenuItem}
 */
function createRemoveHeaderMenuItem () {
  return new MenuItem('removeHeader', {
    text: "Supprimer l'entête",
    icon: 'text',
    context: 'insert',
    onclick: function () {
      window.alert('remove header')
    }
  })
}

/**
 * Create a menu item to insert a footer
 * @function
 * @static
 * @returns {MenuItem}
 */
function createInsertFooterMenuItem () {
  return new MenuItem('insertFooter', {
    text: 'Insérer un pied de page',
    icon: 'abc',
    context: 'insert',
    onclick: function () {
      window.alert('insert footer')
    }
  })
}

/**
 * Create a menu item to remove a footer
 * @function
 * @static
 * @returns {MenuItem}
 */
function createRemoveFooterMenuItem () {
  return new MenuItem('removeFooter', {
    text: 'Supprimer le pied de page',
    icon: 'text',
    context: 'insert',
    onclick: function () {
      window.alert('remove footer')
    }
  })
}

function createInsertPageNumber (editor) {
  return new MenuItem('insertPageNumber', {
    text: 'Insérer le numéro de page',
    context: 'document',
    onPostRender: function () {
      editor.on('NodeChange', resetMenuItemState.bind(this, editor, HEADER_FOOTER_ONLY_SELECTOR))
    },
    cmd: 'insertPageNumberCmd'
  })
}

function createinsertNumberOfPages (editor) {
  return new MenuItem('insertNumberOfPages', {
    text: 'Insérer le nombre de page',
    // icon: 'text',
    context: 'document',
    onPostRender: function () {
      editor.on('NodeChange', resetMenuItemState.bind(this, editor, HEADER_FOOTER_ONLY_SELECTOR))
    },
    cmd: 'insertNumberOfPagesCmd'
  })
}

/**
 * Lock a node
 * @method
 * @memberof ::callerFunction
 */
function lockNode () {
  var $this = $(this)
  $this.attr('contenteditable', false)
  $this.addClass('unselectable')
}

/**
 * Unlock a node
 * @method
 * @memberof ::callerFunction
 */
function unlockNode () {
  var $this = $(this)
  $this.attr('contenteditable', true)
  $this.removeClass('unselectable')
  $this.focus()
}

function addUnselectableCSSClass (editor) {
  var head = $('head', editor.getDoc())
  var unselectableCSSRules = '.unselectable { -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }'
  var style = $('<style>').attr('type', 'text/css').html(unselectableCSSRules)
  style.appendTo(head)
}

/**
* @function
* @inner
*/
function resetMenuItemState (editor, selector) {
  var selectedElement = editor.selection.getStart()
  var $sel = $(selectedElement)
  var parents = $sel.parents(selector)
  this.disabled(!parents.length)
}
