'use strict'

/**
 * This module expose the plugin event handlers
 * @module
 * @name eventHandlers
 */

// var HeaderFooterFactory = require('./classes/HeaderFooterFactory')
// var ui = require('./utils/ui')
// var menuItems = require('./components/menu-items')

module.exports = {
  'Init': {
    setBodies: setBodies
  },
  'NodeChange': {},
  'SetContent': {},
  'BeforeSetContent': {}
}

function setBodies (evt) {
  var editor = evt.target
  this.documentBodies.mce[this.type] = editor.getBody()
  if (!this.documentBodies.app) {
    this.documentBodies.app = window.document.body
  }
}
