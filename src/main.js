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
var getComputedStyle = window.getComputedStyle

var ui = require('./utils/ui')
var menuItems = require('./components/menu-items')
var units = require('./utils/units')
var HeaderFooterFactory = require('./classes/HeaderFooterFactory')

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
  var lastActiveSection = null
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
    forceBodyMinHeightOnNodeChange(evt)
    fixSelectAllOnNodeChange(evt)
    enterBodyNodeOnLoad(evt)
  })
  editor.on('BeforeSetContent', saveLastActiveSectionOnBeforeSetContent)
  editor.on('SetContent', function (evt) {
    reloadHeadFootIfNeededOnSetContent(evt)
    enterBodyNodeOnLoad(evt)
    removeAnyOuterElementOnSetContent(evt)
  })

  /**
   * Make sure the body minimum height is correct, depending the margins, header and footer height.
   * NodeChange event handler.
   * @function
   * @inner
   * @returns void
   */
  function forceBodyMinHeightOnNodeChange (evt) {
    if (headerFooterFactory && headerFooterFactory.hasBody()) {
      var bodyTag = {}
      var bodySection = {}
      var headerSection = {}
      var footerSection = {}
      var pageHeight

      bodySection.node = headerFooterFactory.body.node
      bodySection.height = headerFooterFactory.body.node.offsetHeight
      bodySection.style = window.getComputedStyle(bodySection.node)

      if (headerFooterFactory.hasHeader()) {
        headerSection.node = headerFooterFactory.header.node
        headerSection.height = headerFooterFactory.header.node.offsetHeight
        headerSection.style = window.getComputedStyle(headerSection.node)
      } else {
        headerSection.node = null
        headerSection.height = 0
        headerSection.style = window.getComputedStyle(document.createElement('bogusElement'))
      }

      if (headerFooterFactory.hasFooter()) {
        footerSection.node = headerFooterFactory.footer.node
        footerSection.height = headerFooterFactory.footer.node.offsetHeight
        footerSection.style = window.getComputedStyle(footerSection.node)
      } else {
        footerSection.node = null
        footerSection.height = 0
        footerSection.style = window.getComputedStyle(document.createElement('bogusElement'))
      }

      bodyTag.node = editor.getBody()
      bodyTag.height = units.getValueFromStyle(getComputedStyle(editor.getBody()).minHeight)
      bodyTag.style = window.getComputedStyle(bodyTag.node)
      bodyTag.paddingTop = units.getValueFromStyle(bodyTag.style.paddingTop)
      bodyTag.paddingBottom = units.getValueFromStyle(bodyTag.style.paddingBottom)

      pageHeight = bodyTag.height - bodyTag.paddingTop - bodyTag.paddingBottom - headerSection.height - footerSection.height
      $(bodySection.node).css({ minHeight: pageHeight })
    }
  }

  /**
   * Auto-enter in the body section on document load.
   * (SetContent or NodeChange with some conditions) event handler.
   * @function
   * @inner
   * @returns void
   */
  function enterBodyNodeOnLoad (evt) {
    setTimeout(function () {
      if (headerFooterFactory && headerFooterFactory.hasBody() && !headerFooterFactory.getActiveSection()) {
        headerFooterFactory.body.enterNode()
      }
    }, 500)
  }

  /**
   * Save the last active section on BeforeSetContent to be able to restore it if needed on SetContent event.
   * BeforeSetContent event handler.
   * @function
   * @inner
   * @returns void
   */
  function saveLastActiveSectionOnBeforeSetContent () {
    if (headerFooterFactory) {
      lastActiveSection = headerFooterFactory.getActiveSection()
    }
  }

  /**
   * Remove any element located out of the allowed sections.
   * SetContent event handler.
   * @function
   * @inner
   * @returns void
   */
  function removeAnyOuterElementOnSetContent (evt) {
    var conditions = [
      !!evt.content,
      !!evt.content.length,
      !!editor.getContent(),
      !!editor.getContent().length,
      !!headerFooterFactory
    ]
    if (!~conditions.indexOf(false)) {
      var $body = $(editor.getBody())
      $body.children().each(function (i) {
        var allowedRootNodes = [headerFooterFactory.body.node]
        if (headerFooterFactory.hasHeader()) {
          allowedRootNodes.push(headerFooterFactory.header.node)
        }
        if (headerFooterFactory.hasFooter()) {
          allowedRootNodes.push(headerFooterFactory.footer.node)
        }
        if (!~allowedRootNodes.indexOf(this)) {
          console.error('Removing the following element because it is out of the allowed sections')
          console.log(this)
          $(this).remove()
        }
      })
    }
    if (lastActiveSection) {
      console.info('entering to the last node', lastActiveSection)
      lastActiveSection.enterNode()
      lastActiveSection = null
    }
  }

  /**
   * When pressing Ctrl+A to select all content, force the selection to be contained in the current active section.
   * onNodeChange event handler.
   * @function
   * @inner
   * @returns void
   */
  function fixSelectAllOnNodeChange (evt) {
    if (evt.selectionChange && !editor.selection.isCollapsed()) {
      if (editor.selection.getNode() === editor.getBody()) {
        editor.selection.select(headerFooterFactory.getActiveSection().node)
      }
    }
  }

  /**
   * On init event handler. Instanciate the factory and initialize menu items states
   * @function
   * @inner
   * @returns void
   */
  function onInitHandler () {
    headerFooterFactory = new HeaderFooterFactory(editor)
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
      reloadHeadFoots(menuItems)
    } else {
      setTimeout(reloadHeadFootIfNeededOnSetContent.bind(null, evt), 100)
    }
  }

  function onNodeChange (evt) {
    if (headerFooterFactory) {
      headerFooterFactory.forceCursorToAllowedLocation(evt.element)
    }
  }

  /**
   * Helper function. Do the reload of headers and footers
   * @function
   * @inner
   * @returns void
   */
  function reloadHeadFoots (menuItemsList) {
    var $headFootElmts = $('*[data-headfoot]', editor.getDoc())
    var $bodyElmt = $('*[data-headfoot-body]', editor.getDoc())
    var hasBody = !!$bodyElmt.length
    var $allElmts = null

    // init starting states
    menuItemsList.insertHeader.show()
    menuItemsList.insertFooter.show()
    menuItemsList.removeHeader.hide()
    menuItemsList.removeFooter.hide()

    // set another state and load elements if a header or a footer exists
    $headFootElmts.each(function (i, el) {
      var $el = $(el)
      if ($el.attr('data-headfoot-header')) {
        menuItemsList.insertHeader.hide()
        menuItemsList.removeHeader.show()
      } else if ($el.attr('data-headfoot-body')) {
        // @TODO something ?
      } else if ($el.attr('data-headfoot-footer')) {
        menuItemsList.insertFooter.hide()
        menuItemsList.removeFooter.show()
      }
      headerFooterFactory.loadElement(el)
    })

    if (!hasBody) {
      $allElmts = $(editor.getBody()).children()
      headerFooterFactory.insertBody()
      var $body = $(headerFooterFactory.body.node)
      $body.empty()
      $allElmts.each(function (i, el) {
        var $el = $(el)
        if (!$el.attr('data-headfoot')) {
          $body.append($el)
        }
      })
    }

  }
}
