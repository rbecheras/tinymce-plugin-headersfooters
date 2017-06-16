'use strict'

/**
 * plugin.js
 *
 * Released under LGPL License.
 * Copyright (c) 2017 SIRAP Group All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * plugin.js Tinymce plugin headersfooters
 * @file plugin.js
 * @module
 * @name tinycmce-plugin-headersfooters
 * @description
 * A plugin for tinymce WYSIWYG HTML editor that allow to insert headers and footers
 * @see https://github.com/sirap-group/tinymce-plugin-headersfooters
 * @author Rémi Becheras
 * @author Groupe SIRAP
 * @license GNU GPL-v2 http://www.tinymce.com/license
 */

/**
 * Tinymce library - injected by the plugin loader.
 * @external tinymce
 * @see {@link https://www.tinymce.com/docs/api/class/tinymce/|Tinymce API Reference}
 */
var tinymce = window.tinymce

var menuItems = require('./components/menu-items')
var units = require('./utils/units')
var eventHandlers = require('./event-handlers')

// Add the plugin to the tinymce PluginManager
tinymce.PluginManager.add('headersfooters', tinymcePluginHeadersFooters)

/**
 * Tinymce plugin headers/footers
 * @function
 * @global
 * @param {tinymce.Editor} editor - The injected tinymce editor.
 * @returns void
 */
function tinymcePluginHeadersFooters (editor, url) {
  var thisPlugin = this
  this.headerFooterFactory = null
  this.units = units
  this.editor = editor
  this.menuItemsList = menuItems.create(editor)

  // add the plugin's menu items
  for (var itemName in this.menuItemsList) {
    editor.addMenuItem(itemName, this.menuItemsList[itemName])
  }

  editor.addCommand('insertPageNumberCmd', function () {
    editor.insertContent('{{page}}')
  })
  editor.addCommand('insertNumberOfPagesCmd', function () {
    editor.insertContent('{{pages}}')
  })

  // Bind event callbacks
  var callbackName
  for (callbackName in eventHandlers.onInit) {
    editor.on('init', eventHandlers.onInit[callbackName].bind(thisPlugin))
  }
  for (callbackName in eventHandlers.onNodeChange) {
    editor.on('NodeChange', eventHandlers.onNodeChange[callbackName].bind(thisPlugin))
  }
  for (callbackName in eventHandlers.onBeforeSetContent) {
    editor.on('BeforeSetContent', eventHandlers.onBeforeSetContent[callbackName].bind(thisPlugin))
  }
  for (callbackName in eventHandlers.onSetContent) {
    editor.on('SetContent', eventHandlers.onSetContent[callbackName].bind(thisPlugin))
  }
}
