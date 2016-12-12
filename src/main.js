'use strict'

/**
 * plugin.js
 *
 * Released under LGPL License.
 * Copyright (c) 2016 SIRAP Group All rights reserved
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
 * It will may be used with requires tinymce-plugin-paginate the a near future, but not for now.
 * @link https://github.com/sirap-group/tinymce-plugin-headersfooters
 * @author Rémi Becheras
 * @author Groupe SIRAP
 * @license GNU GPL-v2 http://www.tinymce.com/license
 * @version 1.0.0
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

  editor.on('init', function (evt) {
    eventHandlers.onInit.initHeaderFooterFactory.call(thisPlugin, evt)
    eventHandlers.onInit.initMenuItemsList.call(thisPlugin, evt)
    eventHandlers.onInit.initUI.call(thisPlugin, evt)
  })
  editor.on('NodeChange', function (evt) {
    eventHandlers.onNodeChange.forceCursorToAllowedLocation.call(thisPlugin, evt)
    eventHandlers.onNodeChange.forceBodyMinHeight.call(thisPlugin, evt)
    eventHandlers.onNodeChange.fixSelectAll.call(thisPlugin, evt)
    eventHandlers.onSetContent.enterBodyNodeOnLoad.call(thisPlugin, evt)
  })
  editor.on('BeforeSetContent', function (evt) {
    eventHandlers.onBeforeSetContent.updateLastActiveSection.call(thisPlugin, evt)
  })
  editor.on('SetContent', function (evt) {
    eventHandlers.onSetContent.reloadHeadFootIfNeeded.call(thisPlugin, evt)
    eventHandlers.onSetContent.enterBodyNodeOnLoad.call(thisPlugin, evt)
    eventHandlers.onSetContent.removeAnyOuterElement.call(thisPlugin, evt)
  })
}
