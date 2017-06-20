'use strict'

/**
 * This module expose the plugin event handlers
 * @module
 * @name eventHandlers
 */

// var HeaderFooterFactory = require('./classes/HeaderFooterFactory')
var uiUtils = require('./utils/ui')
// var menuItems = require('./components/menu-items')
// var $ = window.jQuery

module.exports = {
  'Init': {
    setBodies: setBodies,
    setStackedLayout: setStackedLayout
  },
  'NodeChange': {},
  'SetContent': {},
  'BeforeSetContent': {},
  'Focus': {
    showEditor: showEditor
  },
  'Blur': {
    hideEditor: hideEditor
  }
}

function setBodies (evt) {
  var editor = evt.target
  this.documentBodies.mce[this.type] = editor.getBody()
  if (!this.documentBodies.app) {
    this.documentBodies.app = window.document.body
  }
}

function setStackedLayout (evt) {
  uiUtils.mapMceLayoutElements(this.bodyClass, this.stackedLayout)
}

function showEditor (evt) {
  this.enable()
}

function hideEditor (evt) {
  this.disable()
}
