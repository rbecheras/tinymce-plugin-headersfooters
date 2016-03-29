'use strict';

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

var HeaderFooterFactory = require('./classes/HeaderFooterFactory');
var ui = require('./utils/ui');

/**
 * Tinymce plugin headers/footers
 * @function
 * @global
 * @param {tinymce.Editor} editor - The injected tinymce editor.
 * @returns void
 */
function tinymcePluginHeadersFooters(editor,url) {

  function onInitHandler(){
    headerFooterFactory = new HeaderFooterFactory(editor);

    ui.menuItems.insertHeader.onclick = function(){
      headerFooterFactory.insertHeader();
    };
    ui.menuItems.insertFooter.onclick = function(){
      headerFooterFactory.insertFooter();
    };
  }

  window.alert('tinymcePluginHeadersFooters');

  var headerFooterFactory;

  editor.on('init',onInitHandler);

  editor.addMenuItem('insertHeader', ui.menuItems.insertHeader);
  editor.addMenuItem('insertFooter', ui.menuItems.insertFooter);

}

// Add the plugin to the tinymce PluginManager
tinymce.PluginManager.add('headersfooters', tinymcePluginHeadersFooters);
