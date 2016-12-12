'use strict'

/**
 * This module expose the plugin event handlers
 * @module
 * @name eventHandlers
 */

module.exports = {
  onInit: {},
  onNodeChange: {
    forceBodyMinHeight: forceBodyMinHeightOnNodeChange,
    fixSelectAll: fixSelectAllOnNodeChange
  },
  onSetContent: {
    enterBodyNodeOnLoad: enterBodyNodeOnLoadOnSetContent,
    removeAnyOuterElement: removeAnyOuterElementOnSetContent
  },
  onBeforeSetContent: {
    updateLastActiveSection: updateLastActiveSectionOnBeforeSetContent,
    reloadHeadFootIfNeeded: reloadHeadFootIfNeededOnSetContent
  }
}

function forceBodyMinHeightOnNodeChange (evt) {
  var headerFooterFactory = this.headerFooterFactory

  if (headerFooterFactory && headerFooterFactory.hasBody()) {
    headerFooterFactory.forceBodyMinHeigh()
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
  var headerFooterFactory = this.headerFooterFactory

  setTimeout(function () {
    if (headerFooterFactory && headerFooterFactory.hasBody() && !headerFooterFactory.getActiveSection()) {
      headerFooterFactory.body.enterNode()
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
  var headerFooterFactory = this.headerFooterFactory

  if (headerFooterFactory) {
    headerFooterFactory.updateLastActiveSection()
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
  var editor = this.editor
  var headerFooterFactory = this.headerFooterFactory
  var conditions = [
    !!evt.content,
    evt.content && !!evt.content.length,
    !!editor.getContent(),
    !!editor.getContent().length,
    !!headerFooterFactory
  ]
  if (!~conditions.indexOf(false)) {
    headerFooterFactory.removeAnyOuterElement()
  }
  if (headerFooterFactory && headerFooterFactory.lastActiveSection) {
    console.info('entering to the last node', headerFooterFactory.lastActiveSection)
    headerFooterFactory.lastActiveSection.enterNode()
    headerFooterFactory.resetLastActiveSection()
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
  var editor = this.editor
  var headerFooterFactory = this.headerFooterFactory

  if (evt.selectionChange && !editor.selection.isCollapsed()) {
    if (editor.selection.getNode() === editor.getBody()) {
      editor.selection.select(headerFooterFactory.getActiveSection().node)
    }
  }
}

/**
 * On SetContent event handler. Load or reload headers and footers from existing elements if it should do.
 * @function
 * @inner
 * @returns void
 */
function reloadHeadFootIfNeededOnSetContent (evt) {
  var headerFooterFactory = this.headerFooterFactory
  if (headerFooterFactory) {
    headerFooterFactory.reload()
  } else {
    setTimeout(reloadHeadFootIfNeededOnSetContent.bind(this, evt), 100)
  }
}
