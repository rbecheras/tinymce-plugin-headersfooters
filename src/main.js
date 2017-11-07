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
 * @name tinymce-plugin-headersfooters
 * @description
 * A plugin for tinymce WYSIWYG HTML editor that allow to insert headers and footers
 * @see https://github.com/sirap-group/tinymce-plugin-headersfooters
 * @author Rémi Becheras
 * @author Groupe SIRAP
 * @license GNU GPL-v2 http://www.tinymce.com/license
 */

/**
 * The tinymce global namespace
 * @external {tinymce} https://www.tinymce.com/docs/api
 */

/**
 * The tinymce Editor class
 * @external {Editor} https://www.tinymce.com/docs/api/tinymce/tinymce.editor
 */

/**
 * The jQuery global namespace.
 * @external {jQuery} http://api.jquery.com
 */

import HeadersFootersPlugin from './classes/core/HeadersFootersPlugin'

/**
 * Tinymce global API namespace
 * @type {object}
 * @see {@link https://www.tinymce.com/docs/api Tinymce API Reference}
 */
const tinymce = window.tinymce

// Add the plugin to the tinymce PluginManager
tinymce.PluginManager.add('headersfooters', HeadersFootersPlugin)
