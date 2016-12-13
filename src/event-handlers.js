'use strict'

/**
 * This module expose the plugin event handlers
 * @module
 * @name eventHandlers
 */

var HeaderFooterFactory = require('./classes/HeaderFooterFactory')
var ui = require('./utils/ui')
var menuItems = require('./components/menu-items')

module.exports = {
  onInit: {
    initHeaderFooterFactory: initHeaderFooterFactoryOnInit,
    initMenuItemsList: initMenuItemsListOnInit,
    initUI: initUIOnInit
  },
  onNodeChange: {
    forceBodyMinHeight: forceBodyMinHeightOnNodeChange,
    fixSelectAll: fixSelectAllOnNodeChange,
    forceCursorToAllowedLocation: forceCursorToAllowedLocationOnNodeChange
  },
  onSetContent: {
    enterBodyNodeOnLoad: enterBodyNodeOnLoadOnSetContent,
    removeAnyOuterElement: removeAnyOuterElementOnSetContent,
    reloadHeadFootIfNeeded: reloadHeadFootIfNeededOnSetContent
  },
  onBeforeSetContent: {
    updateLastActiveSection: updateLastActiveSectionOnBeforeSetContent
  }
}

function forceBodyMinHeightOnNodeChange (evt) {
  if (this.headerFooterFactory && this.headerFooterFactory.hasBody()) {
    this.headerFooterFactory.forceBodyMinHeigh()
  }
}

/**
 * Auto-enter in the body section on document load.
 * (SetContent or NodeChange with some conditions) event handler.
 * @method
 * @mixin
 * @returns void
 */
function enterBodyNodeOnLoadOnSetContent (evt) {
  var that = this
  setTimeout(function () {
    if (that.headerFooterFactory && that.headerFooterFactory.hasBody() && !that.headerFooterFactory.getActiveSection()) {
      that.headerFooterFactory.body.enterNode()
    }
  }, 500)
}

/**
 * Update the last active section on BeforeSetContent to be able to restore it if needed on SetContent event.
 * BeforeSetContent event handler.
 * @method
 * @mixin
 * @returns void
 */
function updateLastActiveSectionOnBeforeSetContent (evt) {
  if (this.headerFooterFactory) {
    this.headerFooterFactory.updateLastActiveSection()
  }
}

/**
 * Remove any element located out of the allowed sections on SetContent
 * SetContent event handler.
 * @method
 * @mixin
 * @returns void
 */
function removeAnyOuterElementOnSetContent (evt) {
  var conditions = [
    !!evt.content,
    evt.content && !!evt.content.length,
    !!this.editor.getContent(),
    !!this.editor.getContent().length,
    !!this.headerFooterFactory
  ]

  // if all of theses conditions are true (none are false)
  if (!~conditions.indexOf(false)) {
    this.headerFooterFactory.removeAnyOuterElement()
  }
  if (this.headerFooterFactory && this.headerFooterFactory.lastActiveSection) {
    console.info('entering to the last node', this.headerFooterFactory.lastActiveSection)
    this.headerFooterFactory.lastActiveSection.enterNode()
    this.headerFooterFactory.resetLastActiveSection()
  }
}

/**
 * When pressing Ctrl+A to select all content, force the selection to be contained in the current active section.
 * onNodeChange event handler.
 * @method
 * @mixin
 * @returns void
 */
function fixSelectAllOnNodeChange (evt) {
  if (evt.selectionChange && !this.editor.selection.isCollapsed()) {
    if (this.editor.selection.getNode() === this.editor.getBody()) {
      this.editor.selection.select(this.headerFooterFactory.getActiveSection().node)
    }
  }
}

/**
 * On SetContent event handler. Load or reload headers and footers from existing elements if it should do.
 * @method
 * @mixin
 * @returns void
 */
function reloadHeadFootIfNeededOnSetContent (evt) {
  if (this.headerFooterFactory) {
    this.headerFooterFactory.reload()
  } else {
    setTimeout(reloadHeadFootIfNeededOnSetContent.bind(this, evt), 100)
  }
}

/**
 * On NodeChange event handler. Force cursor location to allowedLocations
 * @method
 * @mixin
 * @returns void
 */
function forceCursorToAllowedLocationOnNodeChange (evt) {
  if (this.headerFooterFactory) {
    this.headerFooterFactory.forceCursorToAllowedLocation(evt.element)
  }
}

/**
 * On init event handler. Instanciate the factory.
 * @method
 * @mixin
 * @returns void
 */
function initHeaderFooterFactoryOnInit (evt) {
  this.headerFooterFactory = new HeaderFooterFactory(this.editor, this.menuItemsList)
}

/**
 * On init event handler. Init the menu items list.
 * @method
 * @mixin
 * @returns void
 */
function initMenuItemsListOnInit (evt) {
  menuItems.init(this.headerFooterFactory, this.menuItemsList)
}

/**
 * On init event handler. Init the plugin's needed CSS classes.
 * @method
 * @mixin
 * @returns void
 */
function initUIOnInit (evt) {
  ui.addUnselectableCSSClass(this.editor)
}
