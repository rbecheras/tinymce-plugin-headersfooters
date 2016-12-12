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

var HeaderFooterFactory = require('./classes/HeaderFooterFactory')

var ui = require('./utils/ui')
var menuItems = require('./components/menu-items')
var units = require('./utils/units')
var eventHandlers = require('./eventHandlers')

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
  var headerFooterFactory
  var menuItemsList = menuItems.create(editor)

  this.units = units

  // add the plugin's menu items
  for (var itemName in menuItemsList) {
    editor.addMenuItem(itemName, menuItemsList[itemName])
  }

  editor.addCommand('insertPageNumberCmd', function () {
    editor.insertContent('{{page}}')
  })

  editor.addCommand('insertNumberOfPagesCmd', function () {
    editor.insertContent('{{pages}}')
  })

  editor.on('init', onInitHandler)
  editor.on('NodeChange', function (evt) {
    onNodeChange(evt)
    eventHandlers.onNodeChange.forceBodyMinHeight.call({headerFooterFactory: headerFooterFactory}, evt)
    eventHandlers.onNodeChange.fixSelectAll.call({ headerFooterFactory: headerFooterFactory, editor: editor }, evt)
    eventHandlers.onSetContent.enterBodyNodeOnLoad.call({headerFooterFactory: headerFooterFactory}, evt)
  })
  editor.on('BeforeSetContent', eventHandlers.onBeforeSetContent.updateLastActiveSection.bind({headerFooterFactory: headerFooterFactory}))
  editor.on('SetContent', function (evt) {
    reloadHeadFootIfNeededOnSetContent(evt)
    eventHandlers.onSetContent.enterBodyNodeOnLoad.call({headerFooterFactory: headerFooterFactory}, evt)
    eventHandlers.onSetContent.removeAnyOuterElement.call({ headerFooterFactory: headerFooterFactory, editor: editor }, evt)
  })

  /**
   * On init event handler. Instanciate the factory and initialize menu items states
   * @function
   * @inner
   * @returns void
   */
  function onInitHandler () {
    headerFooterFactory = new HeaderFooterFactory(editor, menuItemsList)
    menuItems.init(headerFooterFactory, menuItemsList)
    ui.addUnselectableCSSClass(editor)
  }

  /**
   * On SetContent event handler. Load or reload headers and footers from existing elements if it should do.
   * @function
   * @inner
   * @returns void
   */
  function reloadHeadFootIfNeededOnSetContent (evt) {
    if (headerFooterFactory) {
      headerFooterFactory.reload(menuItems)
    } else {
      setTimeout(reloadHeadFootIfNeededOnSetContent.bind(null, evt), 100)
    }
  }

  function onNodeChange (evt) {
    if (headerFooterFactory) {
      headerFooterFactory.forceCursorToAllowedLocation(evt.element)
    }
  }
}
