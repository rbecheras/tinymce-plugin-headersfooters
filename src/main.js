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

  var menuItems = {
    insertHeader: ui.createInsertHeaderMenuItem(),
    insertFooter: ui.createInsertFooterMenuItem(),
    removeHeader: ui.createRemoveHeaderMenuItem(),
    removeFooter: ui.createRemoveFooterMenuItem()
  }

  this.units = units

  // add menu items
  editor.addMenuItem('insertHeader', menuItems.insertHeader)
  editor.addMenuItem('removeHeader', menuItems.removeHeader)
  editor.addMenuItem('insertFooter', menuItems.insertFooter)
  editor.addMenuItem('removeFooter', menuItems.removeFooter)

  editor.on('init', onInitHandler)
  editor.on('SetContent', onSetContent)
  editor.on('NodeChange', onNodeChange)
  editor.on('NodeChange', forceBodyMinHeightOnNodeChange)
  editor.on('SetContent NodeChange', enterBodyNodeOnLoad)
  editor.on('BeforeSetContent', saveLastActiveSectionOnBeforeSetContent)
  editor.on('SetContent', removeAnyOuterElementOnSetContent)
  editor.on('NodeChange', fixSelectAllOnNodeChange)

  /**
   * Make sure the body minimum height is correct, depending the margins, header and footer height.
   * NodeChange event handler.
   * @function
   * @inner
   * @returns void
   */
  function forceBodyMinHeightOnNodeChange (evt) {
    if (headerFooterFactory.hasBody()) {
      var bodyTag = {}
      var bodySection = {}
      var headerSection = {}
      var footerSection = {}
      var pageHeight

      bodySection.node = headerFooterFactory.body.node
      bodySection.height = headerFooterFactory.body.node.offsetHeight
      bodySection.style = window.getComputedStyle(bodySection.node)

      headerSection.node = headerFooterFactory.header.node
      headerSection.height = headerFooterFactory.header.node.offsetHeight
      headerSection.style = window.getComputedStyle(headerSection.node)

      footerSection.node = headerFooterFactory.footer.node
      footerSection.height = headerFooterFactory.footer.node.offsetHeight
      footerSection.style = window.getComputedStyle(footerSection.node)

      bodyTag.node = editor.getBody()
      bodyTag.minHeight = getComputedStyle(editor.getBody()).item('min-height')
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
          console.log(this.innerHTML)
          $(this).remove()
        }
      })
    }
    if (lastActiveSection) {
      console.log('entering to node', lastActiveSection)
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
    initMenuItems(headerFooterFactory, menuItems)
    ui.addUnselectableCSSClass(editor)
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
        reloadHeadFoots(menuItems)
      } else {
        setTimeout(reloadHeadFoots.bind(null, menuItems), 100)
      }
    } else {
      // evt.content = '<section data-headfoot="true" data-headfoot-body="true">' + evt.content + '</section>'
    }
  }

  function onNodeChange (evt) {
    headerFooterFactory.forceCursorToAllowedLocation(evt.element)
  }

  /**
   * Helper function. Do the reload of headers and footers
   * @function
   * @inner
   * @returns void
   */
  function reloadHeadFoots (menuItems) {
    var $headFootElmts = $('*[data-headfoot]', editor.getDoc())
    var $bodyElmt = $('*[data-headfoot-body]', editor.getDoc())
    var hasBody = !!$bodyElmt.length
    var $allElmts = null

    // init starting states
    menuItems.insertHeader.show()
    menuItems.insertFooter.show()
    menuItems.removeHeader.hide()
    menuItems.removeFooter.hide()

    // set another state and load elements if a header or a footer exists
    $headFootElmts.each(function (i, el) {
      var $el = $(el)
      if ($el.attr('data-headfoot-header')) {
        menuItems.insertHeader.hide()
        menuItems.removeHeader.show()
      } else if ($el.attr('data-headfoot-body')) {
        // @TODO something ?
      } else if ($el.attr('data-headfoot-footer')) {
        menuItems.insertFooter.hide()
        menuItems.removeFooter.show()
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
