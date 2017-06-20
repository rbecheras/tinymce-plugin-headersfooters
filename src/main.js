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
var events = require('./utils/events')
var uiUtils = require('./utils/ui')

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
  // var thisPlugin = this
  this.type = editor.settings.headersfooters_type
  this.headerFooterFactory = null
  this.units = units
  this.editor = editor
  this.documentBodies = {
    app: null,
    mce: {
      header: null,
      body: null,
      footer: null
    }
  }

  this.menuItemsList = menuItems.create(editor)
  uiUtils.autoAddMenuItems.call(this)

  editor.addCommand('insertPageNumberCmd', function () {
    editor.insertContent('{{page}}')
  })
  editor.addCommand('insertNumberOfPagesCmd', function () {
    editor.insertContent('{{pages}}')
  })

  events.autoBindImplementedEventCallbacks.call(this, editor, eventHandlers)
}
