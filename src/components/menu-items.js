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

var timeUtils = require('../utils/time')
var timestamp = timeUtils.timestamp

/**
 * A selector to select the header and the footer but not the body
 * @const
 * @inner
 */
var HEADER_FOOTER_ONLY_SELECTOR = '.header-panel, .footer-panel'

/**
 * A selector to select the body but not the header and the footer
 * @const
 * @inner
 */
var BODY_ONLY_SELECTOR = '.body-panel'

// Static API
module.exports = {
  create: create
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
    insertHeader: _createInsertHeaderMenuItem(editor),
    insertFooter: _createInsertFooterMenuItem(editor),
    removeHeader: _createRemoveHeaderMenuItem(editor),
    removeFooter: _createRemoveFooterMenuItem(editor),
    insertPageNumber: _createInsertPageNumberMenuItem(editor),
    insertNumberOfPages: _createinsertNumberOfPagesMenuItem(editor),
    editFormat: _createEditFormatMenuItem(editor)
  }
}

/**
 * Create a menu item to insert a header
 * @function
 * @inner
 * @returns {MenuItem}
 */
function _createInsertHeaderMenuItem (editor) {
  return new MenuItem('insertHeader', {
    text: 'Insérer une entête',
    icon: 'template',
    id: 'plugin-headersfooters-menuitem-insert-header' + timestamp(),
    context: 'document',
    onPostRender: function () {
      ui.resetMenuItemState.call(this, editor, BODY_ONLY_SELECTOR)
      editor.on('NodeChange', ui.resetMenuItemState.bind(this, editor, BODY_ONLY_SELECTOR))
    },
    onclick: function () {
      var master = editor.plugins.headersfooters.getMaster()
      master.currentFormat.header.height = '20mm'
      master.currentFormat.header.border.width = '1mm'
      master.currentFormat.header.margins.bottom = '5mm'
      master.currentFormat.applyToPlugin(master)
      master.menuItemsList.insertHeader.hide()
      master.menuItemsList.removeHeader.show()
    }
  })
}

/**
 * Create a menu item to remove a header
 * @function
 * @inner
 * @returns {MenuItem}
 */
function _createRemoveHeaderMenuItem (editor) {
  return new MenuItem('removeHeader', {
    text: "Supprimer l'entête",
    icon: 'undo',
    id: 'plugin-headersfooters-menuitem-remove-header' + timestamp(),
    context: 'document',
    onPostRender: function () {
      ui.resetMenuItemState.call(this, editor, BODY_ONLY_SELECTOR)
      editor.on('NodeChange', ui.resetMenuItemState.bind(this, editor, BODY_ONLY_SELECTOR))
    },
    onclick: function () {
      var master = editor.plugins.headersfooters.getMaster()
      master.currentFormat.header.height = '0'
      master.currentFormat.header.border.width = '0'
      master.currentFormat.header.margins.bottom = '0'
      master.currentFormat.applyToPlugin(master)
      master.menuItemsList.removeHeader.hide()
      master.menuItemsList.insertHeader.show()
    }
  })
}

/**
 * Create a menu item to insert a footer
 * @function
 * @inner
 * @returns {MenuItem}
 */
function _createInsertFooterMenuItem (editor) {
  return new MenuItem('insertFooter', {
    text: 'Insérer un pied de page',
    icon: 'template',
    context: 'document',
    onPostRender: function () {
      ui.resetMenuItemState.call(this, editor, BODY_ONLY_SELECTOR)
      editor.on('NodeChange', ui.resetMenuItemState.bind(this, editor, BODY_ONLY_SELECTOR))
    },
    onclick: function () {
      var master = editor.plugins.headersfooters.getMaster()
      master.currentFormat.footer.height = '20mm'
      master.currentFormat.footer.border.width = '1mm'
      master.currentFormat.footer.margins.top = '5mm'
      master.currentFormat.applyToPlugin(master)
      master.menuItemsList.insertFooter.hide()
      master.menuItemsList.removeFooter.show()
    }
  })
}

/**
 * Create a menu item to remove a footer
 * @function
 * @inner
 * @returns {MenuItem}
 */
function _createRemoveFooterMenuItem (editor) {
  return new MenuItem('removeFooter', {
    text: 'Supprimer le pied de page',
    icon: 'undo',
    context: 'document',
    onPostRender: function () {
      ui.resetMenuItemState.call(this, editor, BODY_ONLY_SELECTOR)
      editor.on('NodeChange', ui.resetMenuItemState.bind(this, editor, BODY_ONLY_SELECTOR))
    },
    onclick: function () {
      var master = editor.plugins.headersfooters.getMaster()
      master.currentFormat.footer.height = '0'
      master.currentFormat.footer.border.width = '0'
      master.currentFormat.footer.margins.top = '0'
      master.currentFormat.applyToPlugin(master)
      master.menuItemsList.removeFooter.hide()
      master.menuItemsList.insertFooter.show()
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
    icon: 'newdocument',
    context: 'document',
    onPostRender: function () {
      ui.resetMenuItemState.call(this, editor, BODY_ONLY_SELECTOR)
      editor.on('NodeChange', ui.resetMenuItemState.bind(this, editor, BODY_ONLY_SELECTOR))
    },
    cmd: 'editFormatCmd'
  })
}
