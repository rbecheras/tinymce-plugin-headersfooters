'use strict'

/**
 * This module expose the plugin event handlers
 * @module
 * @name eventHandlers
 */

module.exports = {
  onInit: {},
  onNodeChange: {
    forceBodyMinHeigh: forceBodyMinHeightOnNodeChange
  },
  onSetContent: {
    enterBodyNodeOnLoad: enterBodyNodeOnLoadOnSetContent
  },
  onBeforeSetContent: {
  }
}

function forceBodyMinHeightOnNodeChange (evt) {
  var headerFooterFactory = evt.headerFooterFactory

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

