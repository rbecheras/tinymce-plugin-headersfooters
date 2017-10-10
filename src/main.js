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
var editFormatOpenMainWin = require('./components/edit-format-window')

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
  this.editor = editor

  this.type = editor.settings.headersfooters_type
  this.bodyClass = editor.settings.body_class
  this.pageNumber = editor.settings.headersfooters_pageNumber

  // bind plugin methods
  this.enable = enable
  this.disable = disable
  this.setFormat = setFormat
  this.parseParamList = parseParamList
  this.reloadMenuItems = reloadMenuItems

  this.isMaster = this.type === 'body'
  this.isSlave = !this.isMaster

  if (this.isMaster) {
    tinymce.getMasterHeadersFootersPlugin = function () {
      return thisPlugin
    }
  }
  this.getMaster = function () {
    if (tinymce.getMasterHeadersFootersPlugin) {
      return tinymce.getMasterHeadersFootersPlugin()
    } else {
      return null
    }
  }

  if (this.isMaster && window.env === 'development') {
    window.mceHF = this
  }
  this.isHeader = isHeader
  this.isBody = isBody
  this.isFooter = isFooter

  this.headerFooterFactory = null

  this.units = units

  this.documentBody = null
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

  if (this.isMaster) {
    this.pageLayout = {
      pageWrapper: null,
      pagePanel: null,
      headerWrapper: null,
      headerPanel: null,
      bodyPanel: null,
      footerWrapper: null,
      footerPanel: null
    }
  }

  this.availableFormats = {}
  this.formats = []
  this.customFormats = []
  this.defaultFormat = null
  this.currentFormat = null

  _setAvailableFormats.call(this)

  this.menuItemsList = menuItems.create(editor)
  uiUtils.autoAddMenuItems.call(this)

  editor.addCommand('insertPageNumberCmd', function () {
    editor.insertContent('{{page}}')
  })
  editor.addCommand('insertNumberOfPagesCmd', function () {
    editor.insertContent('{{pages}}')
  })
  editor.addCommand('editFormatCmd', function () {
    editFormatOpenMainWin(editor)(thisPlugin.currentFormat)
  })

  events.autoBindImplementedEventCallbacks.call(this, editor, eventHandlers)

  // if (window.env === 'development' && this.isMaster) {
  //   setTimeout(function () {
  //     editor.execCommand('editFormatCmd')
  //   })
  // }
}

function enable () {
  this.stackedLayout.menubar.show()
  this.stackedLayout.toolbar.show()
  this.stackedLayout.statusbar.wrapper.show()
  this.stackedLayout.statusbar.path.show()
  this.stackedLayout.statusbar.wordcount.show()
  this.stackedLayout.statusbar.resizehandle.show()

  this.stackedLayout.statusbar.wrapper.css({left: 0, right: 0, zIndex: 9999})

  this.editor.$('body').css({opacity: 1})
}

function disable () {
  this.stackedLayout.menubar.hide()
  this.stackedLayout.toolbar.hide()
  this.stackedLayout.statusbar.wrapper.hide()
  this.stackedLayout.statusbar.path.hide()
  this.stackedLayout.statusbar.wordcount.hide()
  this.stackedLayout.statusbar.resizehandle.hide()

  if (!this.editor.selection.isCollapsed()) {
    this.editor.selection.collapse()
  }
  this.editor.$('body').css({opacity: 0.25})
}

function _setAvailableFormats () {
  var that = this
  var settings = this.editor.settings

  // set enabled default formats
  var userEnabledDefaultFormats = this.parseParamList(settings.headersfooters_formats)
  .map(function (formatName) {
    return Format.defaults[formatName]
  })
  .filter(function (v) {
    return !!v
  })
  if (userEnabledDefaultFormats.length) {
    this.formats = userEnabledDefaultFormats
  } else {
    this.formats = []
    for (var name in Format.defaults) {
      that.formats.push(Format.defaults[name])
    }
  }

  // set user custom formats
  this.customFormats = (settings.headersfooters_custom_formats || [])
  .map(function (f) {
    return new Format(f.name, f.config)
  })

  // set the formats available for the editor
  this.availableFormats = {}
  // use enabled default formats
  this.formats.map(function (f) {
    that.availableFormats[f.name] = f
  })
  // add or override custom formats
  this.customFormats.map(function (f) {
    that.availableFormats[f.name] = f
  })

  // select a default format for new doc
  this.defaultFormat = this.availableFormats[settings.headersfooters_default_format] || this.formats[0] || this.customFormats[0]

  // current format is set on editor init callback
}

function setFormat (format) {
  this.currentFormat = new Format(format.name, format)
  this.editor.fire('HeadersFooters:SetFormat')
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

/**
 * Helper function. Do the reload of headers and footers
 * @method
 * @returns {undefined}
 */
function reloadMenuItems () {
  if (this.currentFormat) {
    if (this.currentFormat.header.height && this.currentFormat.header.height !== '0') {
      this.menuItemsList.insertHeader.hide()
      this.menuItemsList.removeHeader.show()
    } else {
      this.menuItemsList.insertHeader.show()
      this.menuItemsList.removeHeader.hide()
    }
    if (this.currentFormat.footer.height && this.currentFormat.footer.height !== '0') {
      this.menuItemsList.insertFooter.hide()
      this.menuItemsList.removeFooter.show()
    } else {
      this.menuItemsList.insertFooter.show()
      this.menuItemsList.removeFooter.hide()
    }
  }
}

function isHeader () {
  return this.type === 'header'
}

function isBody () {
  return this.type === 'body'
}

function isFooter () {
  return this.type === 'footer'
}
