'use strict'

var q = require('q')
var $ = window.jQuery

module.exports = MenuItem

/**
 * MenuItem Class
 * @class
 * @param {String} name The item name
 * @param {object} options The menu item options
 * @example
 * tinymce.activeEditor.addMenuItem(new MenuItem('myAction',{
 *   icon: 'text',
 *   text: 'My Action',
 *   visible: true,
 *   disabled: true,
 *   onclick: function(){
 *    window.alert('overiden default onclick action')
 *   }
 * }))
 */
function MenuItem (name, options) {
  this.name = name
  _setUIControlPromise(this)
  for (var key in options) {
    if (key !== 'visible' && key !== 'disabled') {
      this[key] = options[key]
    }
  }
  if (!options.id) {
    this.id = 'mce-plugin-headersfooters-' + camel2Dash(name)
  }
  if (options.visible === false) this.hide()
  if (options.disabled) this.disable()
}

/**
 * Returns the menu item UI control as a jquery object
 * @method
 * @returns {Promise} A promise resolved by the jquery wrapper of the menu item's node element
 * @example
 * var menuElement = ui.menuItems.insertHeader.getUIControl()
 * menuElement.css('color','red')
 */
MenuItem.prototype.getUIControl = function () {
  var that = this
  return this._renderingPromise.then(function () {
    return $('#' + that.id)
  })
}

/**
 * By default on click, the menu item logs on console it has been clicked and returns it to allow chainable behavior.
 * This method should be overriden after instanciation (see example).
 * @method
 * @returns void
 * @example
 * // to override this placehoder callback, juste assign a new one
 * var menuItem = new MenuItem('my menu item', options)
 * menuItem.onclick = function () {
 * 	// implement your own
 * }
 */
MenuItem.prototype.onclick = function () {
  console.info('%s menu item has been clicked', this.name)
}

/**
 * Show the menu item UI control and returns it to allow chainable behavior.
 * @method
 * @returns {Promise} A promise resolved by the menu item
 * @example
 * var menuItem = new MenuItem('my menu item', options)
 * menuItem.show().then(function (menuItem) {
 *   // the menuItem is given as first argument
 *   menuItem.disable() // now the menu item is shown but disabled
 * })
 */
MenuItem.prototype.show = function () {
  return this.getUIControl().then(function (uiControl) {
    uiControl.show()
    return uiControl
  })
}

/**
 * Hide the menu item UI control and returns it to allow chainable behavior.
 * @method
 * @returns {Promise} A promise resolved by the menu item
 */
MenuItem.prototype.hide = function () {
  return this.getUIControl().then(function (uiControl) {
    uiControl.hide()
    return uiControl
  })
}

/**
 * Disable the menu item and returns it to allow chainable behavior.
 * @method
 * @returns {Promise} A promise resolved by the menu item
 * @example
 * var menuItem = new MenuItem('my menu item', options)
 * menuItem.show().then(function (menuItem) {
 *   // the menuItem is given as first argument
 *   menuItem.disable().then(function (menuItem) {
 *     // now the menu item is shown but disabled
 *     // the menuItem is again given as first argument
 *     setTimeout(function () {
 *       menuItem.enable() // enable the menu item 2sec after it has been disabled
 *     },2000)
 *   })
 * })
 */
MenuItem.prototype.disable = function () {
  return this.getUIControl().then(function (uiControl) {
    uiControl.addClass('mce-disabled')
    return uiControl
  })
}

/**
 * Enable the menu item and returns it to allow chainable behavior.
 * @method
 * @returns {Promise} A promise resolved by the menu item
 * @example
 * var menuItem = new MenuItem('my menu item', options)
 * menuItem.enable().then(function (menuItem) {
 *   setTimeout(function () {
 *     menuItem.disable() // disable the menu item 2sec after it has been enabled
 *   },2000)
 * })
 */
MenuItem.prototype.enable = function () {
  return this.getUIControl().then(function (uiControl) {
    uiControl.removeClass('mce-disabled')
    return uiControl
  })
}

/**
 * Create a promise that will be resolved when the menu item will be rendered the first time.
 * This promise will be used by all methods needing to get the UI control (node element)
 * It returns nothing and it must be called on top of the MenuItem constructor
 * @method
 * @memberof MenuItem
 * @private
 * @param {MenuItem} that The context for the private method
 * @returns void
 * @example
 * function MenuItem (name, options) {
 *   this.name = name
 *   _setUIControlPromise(this) // this step must be done more earlier as possible to get access to the DOMNode when it will be rendered
 *   // continue to build the instance
 * }
 */
function _setUIControlPromise (that) {
  var d = q.defer()
  var $body = $('body')

  // resolve menuItems DOM elements
  $body.on('menusController:mceMenuRendered', function (evt, menu) {
    $('.mce-menu-item', menu).each(function (i, item) {
      if ($(item).attr('id') === that.id) d.resolve(item)
    })
  })
  // $body.on('menusController:mceMenuItemRendered', function (evt, itemID) {
  //   console.info('menusController:mceMenuItemRendered', itemID)
  //   if (itemID === that.id) d.resolve()
  // })
  that._renderingPromise = d.promise
}

/**
 * Converts a camel cased string to a dashed string
 * @method
 * @private
 * @memberof MenuItem
 * @param {String} inputStr The input string to dasherize
 * @example
 * var camelCasedString = 'helloWorld'
 * var dashedString = camel2Dash(s)
 * console.log(dashedString)
 * // -> hello-world
 */
function camel2Dash (inputStr) {
  if (!inputStr.replace) throw new Error('The replace() method is not available.')
  return inputStr.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}
