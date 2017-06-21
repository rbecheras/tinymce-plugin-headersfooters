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
    setStackedLayout: setStackedLayout,
    applyDefaultFormat: applyDefaultFormat
  },
  'NodeChange': {},
  'SetContent': {},
  'BeforeSetContent': {},
  'Focus': {
    enterHeadFoot: enterHeadFoot
  },
  'Blur': {
    leaveHeadFoot: leaveHeadFoot
  },
  'KeyDown Paste SetContent NodeChange': {
    applyCurrentFormat: applyCurrentFormat
  }
}

function setBodies (evt) {
  var editor = evt.target
  this.documentBodies.mce[this.type] = editor.getBody()
  if (!this.documentBodies.app) {
    this.documentBodies.app = window.document.body
  }
  this.documentBody = editor.getBody()
}

function setStackedLayout (evt) {
  uiUtils.mapMceLayoutElements(this.bodyClass, this.stackedLayout)
}

function enterHeadFoot (evt) {
  this.enable()
}

function leaveHeadFoot (evt) {
  this.disable()
}

function applyCurrentFormat (evt) {
  if (this.currentFormat) {
    this.currentFormat.applyToPlugin(this)
  }
}

function applyDefaultFormat (evt) {
  this.currentFormat = this.defaultFormat
  this.currentFormat.applyToPlugin(this)
}
