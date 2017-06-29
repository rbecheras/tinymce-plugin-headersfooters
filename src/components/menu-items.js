'use strict'

/**
 * MenuItems components
 * @module
 * @name menuItems
 * @description A module to provide a function to create all of the menu items for the plugin
 */

/**
 * Class MenuItem
 * @var
 * @name MenuItem
 * @type class
 */
var MenuItem = require('../classes/MenuItem')

/**
 * UI module
 * @var
 * @name ui
 * @type {Module}
 */
var ui = require('../utils/ui')

/**
 * A selector to select the header and the footer but not the body
 * @const
 * @inner
 */
var HEADER_FOOTER_ONLY_SELECTOR = '.header-panel, .footer-panel'

// Static API
module.exports = {
  create: create,
  init: init
}

// Inner API
// _createInsertHeaderMenuItem()
// _createInsertFooterMenuItem()
// _createRemoveHeaderMenuItem()
// _createRemoveFooterMenuItem()
// _createInsertPageNumberMenuItem(editor)
// _createinsertNumberOfPagesMenuItem(editor)
// _createEditFormatMenuItem(editor)

/**
 * Create a hash of all the menu items for the plugin
 * @function
 * @param {Editor} editor The tinymce active editor
 * @returns {object} the created hash of menu items
 */
function create (editor) {
  return {
    insertHeader: _createInsertHeaderMenuItem(),
    insertFooter: _createInsertFooterMenuItem(),
    removeHeader: _createRemoveHeaderMenuItem(),
    removeFooter: _createRemoveFooterMenuItem(),
    insertPageNumber: _createInsertPageNumberMenuItem(editor),
    insertNumberOfPages: _createinsertNumberOfPagesMenuItem(editor),
    editFormat: _createEditFormatMenuItem(editor)
  }
}

/**
 * Initialize menu items states (show, hide, ...) and implements onclick handlers
 * @method
 * @static
 * @param {HeaderFooterFactory} factory The header and footer factory
 * @param {object} menuItems The set of plugin's menu items
 * @returns undefined
 */
function init (factory, menuItems) {
  // on startup, hide remove buttons
  menuItems.removeHeader.hide()
  menuItems.removeFooter.hide()

  // override insertHeader, insertFooter, removeHeader and removeFooter onclick handlers
  menuItems.insertHeader.onclick = function () {
    factory.insertHeader()
    menuItems.insertHeader.hide()
    menuItems.removeHeader.show()
  }
  menuItems.insertFooter.onclick = function () {
    factory.insertFooter()
    menuItems.insertFooter.hide()
    menuItems.removeFooter.show()
  }
  menuItems.removeHeader.onclick = function () {
    factory.removeHeader()
    menuItems.insertHeader.show()
    menuItems.removeHeader.hide()
  }
  menuItems.removeFooter.onclick = function () {
    factory.removeFooter()
    menuItems.insertFooter.show()
    menuItems.removeFooter.hide()
  }
}

/**
 * Create a menu item to insert a header
 * @function
 * @inner
 * @returns {MenuItem}
 */
function _createInsertHeaderMenuItem () {
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
 * @inner
 * @returns {MenuItem}
 */
function _createRemoveHeaderMenuItem () {
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
 * @inner
 * @returns {MenuItem}
 */
function _createInsertFooterMenuItem () {
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
 * @inner
 * @returns {MenuItem}
 */
function _createRemoveFooterMenuItem () {
  return new MenuItem('removeFooter', {
    text: 'Supprimer le pied de page',
    icon: 'text',
    context: 'insert',
    onclick: function () {
      window.alert('remove footer')
    }
  })
}

/**
 * Create a menu item to insert page number
 * @function
 * @inner
 * @returns {MenuItem}
 */
function _createInsertPageNumberMenuItem (editor) {
  return new MenuItem('insertPageNumber', {
    text: 'Insérer le numéro de page',
    context: 'document',
    onPostRender: function () {
      ui.resetMenuItemState.call(this, editor, HEADER_FOOTER_ONLY_SELECTOR)
      editor.on('NodeChange', ui.resetMenuItemState.bind(this, editor, HEADER_FOOTER_ONLY_SELECTOR))
    },
    cmd: 'insertPageNumberCmd'
  })
}

/**
 * Create a menu item to insert the number of pages
 * @function
 * @inner
 * @returns {MenuItem}
 */
function _createinsertNumberOfPagesMenuItem (editor) {
  return new MenuItem('insertNumberOfPages', {
    text: 'Insérer le nombre de page',
    // icon: 'text',
    context: 'document',
    onPostRender: function () {
      ui.resetMenuItemState.call(this, editor, HEADER_FOOTER_ONLY_SELECTOR)
      editor.on('NodeChange', ui.resetMenuItemState.bind(this, editor, HEADER_FOOTER_ONLY_SELECTOR))
    },
    cmd: 'insertNumberOfPagesCmd'
  })
}

/**
 * Create a menu item to edit the current format
 * @function
 * @inner
 * @returns {MenuItem}
 */
function _createEditFormatMenuItem (editor) {
  return new MenuItem('editFormat', {
    text: 'Format',
    // icon: 'text',
    context: 'document',
    cmd: 'editFormatCmd'
  })
}
