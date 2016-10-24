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

/**
 * The jQuery plugin namespace - plugin dependency.
 * @external "jQuery.fn"
 * @see {@link http://learn.jquery.com/plugins/|jQuery Plugins}
 */
var $ = window.jQuery

var HeaderFooterFactory = require('./classes/HeaderFooterFactory')
var ui = require('./utils/ui')

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

  // add menu items
  editor.addMenuItem('insertHeader', ui.menuItems.insertHeader)
  editor.addMenuItem('removeHeader', ui.menuItems.removeHeader)
  editor.addMenuItem('insertFooter', ui.menuItems.insertFooter)
  editor.addMenuItem('removeFooter', ui.menuItems.removeFooter)

  editor.on('init', onInitHandler)
  editor.on('SetContent', onSetContent)

  /**
   * On init event handler. Instanciate the factory and initialize menu items states
   * @function
   * @inner
   * @returns void
   */
  function onInitHandler () {
    headerFooterFactory = new HeaderFooterFactory(editor)
    initMenuItems(headerFooterFactory, ui.menuItems)
  }

  /**
   * On SetContent event handler. Load or reload headers and footers from existing elements if it should do.
   * @function
   * @inner
   * @returns void
   */
  function onSetContent (evt) {
    // var $bodyElmt = $('body', editor.getDoc())
    var content = $(editor.getBody()).html()
    var emptyContent = '<p><br data-mce-bogus="1"></p>'
    if (content && content !== emptyContent) {
      if (headerFooterFactory) {
        reloadHeadFoots()
      } else {
        setTimeout(reloadHeadFoots, 100)
      }
    }
  }

  /**
   * Helper function. Do the reload of headers and footers
   * @function
   * @inner
   * @returns void
   */
  function reloadHeadFoots () {
    var $headFootElmts = $('*[data-headfoot]', editor.getDoc())

    // init starting states
    ui.menuItems.insertHeader.show()
    ui.menuItems.insertFooter.show()
    ui.menuItems.removeHeader.hide()
    ui.menuItems.removeFooter.hide()

    // set another state and load elements if a header or a footer exists
    $headFootElmts.each(function (i, el) {
      var $el = $(el)
      if ($el.attr('data-headfoot-header')) {
        ui.menuItems.insertHeader.hide()
        ui.menuItems.removeHeader.show()
      } else if ($el.attr('data-headfoot-footer')) {
        ui.menuItems.insertFooter.hide()
        ui.menuItems.removeFooter.show()
      }
      headerFooterFactory.loadElement(el)
    })
  }
}

/**
 * Initialize menu items states (show, hide, ...) and implements onclick handlers
 * @function
 * @inner
 * @param {HeaderFooterFactory} factory The header and footer factory
 * @param {object} menuItems The set of plugin's menu items
 * @returns undefined
 */
function initMenuItems (factory, menuItems) {
  // on startup, hide remove buttons
  menuItems.removeHeader.hide()
  menuItems.removeFooter.hide()

  // override insertHeader, insertFooter, removeHeader and removeFooter onclick handlers
  menuItems.insertHeader.onclick = function () {
    factory.insertHeader()
    menuItems.insertHeader.hide()
    menuItems.removeHeader.show()
  }
  menuItems.insertFooter.onclick = function () {
    factory.insertFooter()
    menuItems.insertFooter.hide()
    menuItems.removeFooter.show()
  }
  menuItems.removeHeader.onclick = function () {
    factory.removeHeader()
    menuItems.insertHeader.show()
    menuItems.removeHeader.hide()
  }
  menuItems.removeFooter.onclick = function () {
    factory.removeFooter()
    menuItems.insertFooter.show()
    menuItems.removeFooter.hide()
  }
}
