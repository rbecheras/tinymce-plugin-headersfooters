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
 * @description A plugin for tinymce WYSIWYG HTML editor that allow to insert headers and footers - requires tinymce-plugin-paginate.
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
/*global tinymce:true */

/**
 * The jQuery plugin namespace - plugin dependency.
 * @external "jQuery.fn"
 * @see {@link http://learn.jquery.com/plugins/|jQuery Plugins}
 */
/*global jquery:true */

var HeaderFooterFactory = require('./classes/HeaderFooterFactory')
var ui = require('./utils/ui')

/**
 * Tinymce plugin headers/footers
 * @function
 * @global
 * @param {tinymce.Editor} editor - The injected tinymce editor.
 * @returns void
 */
function tinymcePluginHeadersFooters (editor, url) {
  function onInitHandler () {
    // instanciate the factory
    headerFooterFactory = new HeaderFooterFactory(editor)

    // hide remove buttons
    ui.menuItems.removeHeader.show().disable()
    ui.menuItems.removeFooter.show().disable()

    // override insertHeader onclick handler
    ui.menuItems.insertHeader.onclick = function () {
      headerFooterFactory.insertHeader()
      ui.menuItems.insertHeader.disable()
      ui.menuItems.removeHeader.enable()
    }

    // overrides insertFooter onclick handler
    ui.menuItems.insertFooter.onclick = function () {
      headerFooterFactory.insertFooter()
      ui.menuItems.insertFooter.disable()
      ui.menuItems.removeFooter.enable()
    }

    editor.on('SetContent', onSetContent)
  }

  function onSetContent (evt) {
    var $bodyElmt = $('body', editor.getDoc())
    var $headFootElmts = $('*[data-headfoot]', editor.getDoc())
    $headFootElmts.each(function (i, el) {
      headerFooterFactory.loadElement(el)
    })
  }

  var headerFooterFactory

  // add menu items
  editor.addMenuItem('insertHeader', ui.menuItems.insertHeader)
  editor.addMenuItem('removeHeader', ui.menuItems.removeHeader)
  editor.addMenuItem('insertFooter', ui.menuItems.insertFooter)
  editor.addMenuItem('removeFooter', ui.menuItems.removeFooter)

  editor.on('init', onInitHandler)

}

// Add the plugin to the tinymce PluginManager
tinymce.PluginManager.add('headersfooters', tinymcePluginHeadersFooters)
