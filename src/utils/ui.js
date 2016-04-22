'use strict';

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
var MenuItem = require('../classes/MenuItem');

/**
 * A hash of menu items options
 * @var
 * @name menuItems
 * @type  {object}
 *
 */
var menuItems = exports.menuItems = {};

/**
 * Insert header menu item
 * @var
 * @name insertHeader
 * @type {MenuItem}
 * @memberof menuItems
 */
menuItems.insertHeader = new MenuItem('insertHeader',{
  text: 'Insérer une entête',
  icon: 'abc',
  id: 'plugin-headersfooters-menuitem-insert-header',
  context: 'insert',
  onclick: function(){
    window.alert('insert header');
  }
});

/**
 * Remove header menu item
 * @var
 * @name removeHeader
 * @type {MenuItem}
 * @memberof menuItems
 */
menuItems.removeHeader = new MenuItem('removeHeader',{
  text: 'Supprimer l\'entête',
  icon: 'text',
  context: 'insert',
  onclick: function(){
    window.alert('remove header');
  }
});

/**
 * Insert footer menu item
 * @var
 * @name insertFooter
 * @type {MenuItem}
 * @memberof menuItems
 */
menuItems.insertFooter = new MenuItem('insertFooter',{
  text: 'Insérer un pied de page',
  icon: 'abc',
  context: 'insert',
  onclick: function(){
    window.alert('insert footer');
  }
});

/**
 * Remove footer menu item
 * @var
 * @name removeFooter
 * @type {MenuItem}
 * @memberof menuItems
 */
menuItems.removeFooter = new MenuItem('removeFooter',{
  text: 'Supprimer le pied de page',
  icon: 'text',
  context: 'insert',
  onclick: function(){
    window.alert('remove footer');
  }
});


exports.lockNode = function(){
  $(this).attr('contenteditable',false);
};
exports.unlockNode = function(){
  $(this).attr('contenteditable',true);
  $(this).focus();
};
