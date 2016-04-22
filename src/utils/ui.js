'use strict';

/**
 * User interface module
 * @module
 * @name ui
 * @description A module to provide configured ui elements to the plugin
 */


/**
 * A hash of menu items options
 * @var
 * @name menuItems
 * @type  {object}
 *
 */
var menuItems = {};
/**
 * Insert header menu item
 * @var
 * @name insertHeader
 * @type {object}
 * @memberof menuItems
 */
menuItems.insertHeader = {
  text: 'Insérer une entête',
  icon: 'abc',
  context: 'insert',
  onclick: function(){
    window.alert('insert header');
  }
};
/**
 * Insert footer menu item
 * @var
 * @name insertFooter
 * @type {object}
 * @memberof menuItems
 */
menuItems.insertFooter = {
  text: 'Insérer un pied de page',
  icon: 'abc',
  context: 'insert',
  onclick: function(){
    window.alert('insert footer');
  }
};

exports.menuItems = menuItems;

exports.lockNode = function(){
  $(this).attr('contenteditable',false);
};
exports.unlockNode = function(){
  $(this).attr('contenteditable',true);
  $(this).focus();
};
