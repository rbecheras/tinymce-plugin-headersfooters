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
var HEADER_FOOTER_ONLY_SELECTOR = 'section[data-headfoot-header], section[data-headfoot-footer]'

module.exports = createMenuItems

/**
 * Create a hash of all the menu items for the plugin
 * @function
 * @param {Editor} editor The tinymce active editor
 * @returns {object} the created hash of menu items
 */
function createMenuItems (editor) {
  return {
    insertHeader: createInsertHeaderMenuItem(),
    insertFooter: createInsertFooterMenuItem(),
    removeHeader: createRemoveHeaderMenuItem(),
    removeFooter: createRemoveFooterMenuItem(),
    insertPageNumber: createInsertPageNumber(editor),
    insertNumberOfPages: createinsertNumberOfPages(editor)
  }
}

/**
 * Create a menu item to insert a header
 * @function
 * @inner
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
 * @inner
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
 * @inner
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
 * @inner
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

/**
 * Create a menu item to insert page number
 * @function
 * @inner
 * @returns {MenuItem}
 */
function createInsertPageNumber (editor) {
  return new MenuItem('insertPageNumber', {
    text: 'Insérer le numéro de page',
    context: 'document',
    onPostRender: function () {
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
function createinsertNumberOfPages (editor) {
  return new MenuItem('insertNumberOfPages', {
    text: 'Insérer le nombre de page',
    // icon: 'text',
    context: 'document',
    onPostRender: function () {
      editor.on('NodeChange', ui.resetMenuItemState.bind(this, editor, HEADER_FOOTER_ONLY_SELECTOR))
    },
    cmd: 'insertNumberOfPagesCmd'
  })
}
