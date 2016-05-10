'use strict'

var $ = window.jQuery

module.exports = MenuItem

/**
 * MenuItem Class
 * @class
 * @param {String} name The item name
 * @param {object} options The menu item options
 * @example
  <code>
  tinymce.activeEditor.addMenuItem(new MenuItem('myAction',{
    icon: 'text',
    text: 'My Action',
    visible: true,
    disabled: true,
    onclick: function(){
     window.alert('overiden default onclick action')
    }
  }))
  </code>
 */
function MenuItem (name, options) {
  this.name = name
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
 * @returns {Array} the jquery object wrapped in jquery array of lenght 1
 * @example
  <code>
    var menuElement = ui.menuItems.insertHeader.getUIControl()
    menuElement.css('color','red')
  </code>
 */
MenuItem.prototype.getUIControl = function () {
  return $('#' + this.id)
}

/**
 * By default on click, the menu item logs on console it has been clicked and returns it to allow chainable behavior.
 * This method should be overriden after instanciation.
 * Be caution when ovveriding, please returns the menu item in the method to not break the chainable behavior allowed by the default implementation.
 * @method
 * @returns void
 */
MenuItem.prototype.onclick = function () {
  console.info('%s menu item has been clicked', this.name)
  return this
}

/**
 * Show the menu item UI control and returns it to allow chainable behavior.
 * @method
 * @returns {MenuItem} the menu item
 */
MenuItem.prototype.show = function () {
  this.getUIControl().show()
  return this
}

/**
 * Hide the menu item UI control and returns it to allow chainable behavior.
 * @method
 * @returns {MenuItem} the menu item
 */
MenuItem.prototype.hide = function () {
  this.getUIControl().hide()
  return this
}

/**
 * Disable the menu item and returns it to allow chainable behavior.
 * @method
 * @returns {MenuItem} the menu item.
 */
MenuItem.prototype.disable = function () {
  this.getUIControl().addClass('mce-disabled')
  return this
}

/**
 * Enable the menu item and returns it to allow chainable behavior.
 * @method
 * @returns {MenuItem} the menu item
 */
MenuItem.prototype.enable = function () {
  this.getUIControl().removeClass('mce-disabled')
  return this
}

/**
 * Converts a camel cased string to a dashed string
 * @function
 * @inner
 * @param {String} inputStr The input string to dasherize
 * @example
 * <code>
    var s = 'helloWorld'
    camel2Dash(s)
    // -> hello-world
    </code>
 */
function camel2Dash (inputStr) {
  if (!inputStr.replace) throw new Error('The replace() method is not available.')
  return inputStr.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}
