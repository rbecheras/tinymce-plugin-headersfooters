'use strict'

var $ = window.jQuery

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
  lockNode: lockNode,
  unlockNode: unlockNode
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

/**
 * Lock a node
 * @method
 * @memberof ::callerFunction
 */
function lockNode () {
  $(this).attr('contenteditable', false)
}

/**
 * Unlock a node
 * @method
 * @memberof ::callerFunction
 */
function unlockNode () {
  $(this).attr('contenteditable', true)
  $(this).focus()
}
