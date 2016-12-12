'use strict'

/**
 * plugin.js
 * @file plugin.js
 *
 * @copyright (c) 2016 SIRAP Group All rights reserved
 * @link https://github.com/sirap-group/tinymce-plugin-headersfooters
 * @author Rémi Becheras
 * @author Groupe SIRAP
 * @license GNU GPL-v2 http://www.tinymce.com/license
 * @version 1.0.0
 * @see module:TinymcePluginHeadersFooters
 * @description
 * <blockquote><strong>This is the main file. It exposes the TinymcePluginHeadersFooters module</strong></blockquote>
 * <dl class="details">
 *   <dt>Repository:</dt>
 *   <dd>
 *     <ul>
 *       <li><a href="https://github.com/sirap-group/tinymce-plugin-headersfooters">https://github.com/sirap-group/tinymce-plugin-headersfooters</a>
 *     </ul>
 *   </dd>
 *   <dt>Contributing:</dt>
 *   <dd>
 *     <ul>
 *       <li><a href="https://github.com/sirap-group/tinymce-plugin-headersfooters/blob/master/README.md">https://github.com/sirap-group/tinymce-plugin-headersfooters/blob/master/README.md</a>
 *       <li><a href="http://www.tinymce.com/contributing">http://www.tinymce.com/contributing</a>
 *     </ul>
 *   </dd>
 *   <dt>Lisense:</dt>
 *   <dd>
 *     <ul>
 *       <li><a href="http://www.tinymce.com/license">http://www.tinymce.com/license</a>
 *     </ul>
 *   </dd>
 *   <dt>Installation</dt>
 *   <dd>
 *     <pre style="margin-left:2em">npm install --save tinymce-plugin-headersfooters</pre>
 *     or
 *     <pre style="margin-left:2em">bower install --save tinymce-plugin-headersfooters</pre>
 *   </dd>
 * </dl>
 */

/**
 * plugin.js Tinymce plugin headersfooters
 * @module
 * @name TinymcePluginHeadersFooters
 * @description
 * A plugin for tinymce WYSIWYG HTML editor that allow to insert headers and footers
 * It will may be used with requires tinymce-plugin-paginate the a near future, but not for now.
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
