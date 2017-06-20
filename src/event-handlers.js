'use strict'

/**
 * This module expose the plugin event handlers
 * @module
 * @name eventHandlers
 */

// var HeaderFooterFactory = require('./classes/HeaderFooterFactory')
// var ui = require('./utils/ui')
// var menuItems = require('./components/menu-items')
var $ = window.jQuery

module.exports = {
  'Init': {
    setBodies: setBodies,
    setStackedLayout: setStackedLayout
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

function setStackedLayout (evt) {
  this.stackedLayout.root = $('.' + this.bodyClass)
  this.stackedLayout.wrapper = this.stackedLayout.root.children('.mce-tinymce')
  this.stackedLayout.layout = this.stackedLayout.wrapper.children('.mce-stack-layout')
  this.stackedLayout.menubar = this.stackedLayout.layout.children('.mce-stack-layout-item.mce-menubar.mce-toolbar')
  this.stackedLayout.toolbar = this.stackedLayout.layout.children('.mce-stack-layout-item.mce-toolbar-grp')
  this.stackedLayout.editarea = this.stackedLayout.layout.children('.mce-stack-layout-item.mce-edit-area')
  this.stackedLayout.statusbar = this.stackedLayout.layout.children('.mce-stack-layout-item.mce-statusbar')
}
