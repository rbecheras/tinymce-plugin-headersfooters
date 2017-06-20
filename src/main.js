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
var Format = require('./classes/Format')

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
  this.bodyClass = editor.settings.body_class

  // bind plugin methods
  this.enable = enable
  this.disable = disable
  this.parseParamList = parseParamList

  this.isMaster = this.type === 'body'
  this.isSlave = !this.isMaster

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
  this.stackedLayout = {
    root: null,
    wrapper: null,
    layout: null,
    menubar: null,
    toolbar: null,
    editarea: null,
    statusbar: null
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

function enable () {
  // console.info('Enabling ' + this.type + '...')
  this.stackedLayout.menubar.show()
  this.stackedLayout.toolbar.show()
  this.stackedLayout.statusbar.show()
}

function disable () {
  // console.info('Disabling ' + this.type + '...')
  this.stackedLayout.menubar.hide()
  this.stackedLayout.toolbar.hide()
  this.stackedLayout.statusbar.hide()
}

function parseParamList (paramValue) {
  if (paramValue === undefined) {
    return []
  }
  if (typeof paramValue !== 'string') {
    throw new TypeError('paramValue must be a String, ' + typeof paramValue + ' given.')
  }
  return paramValue.split(' ')
}
