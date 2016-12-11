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
  onSetContent: {},
  onBeforeSetContent: {}
}

function forceBodyMinHeightOnNodeChange (evt) {
  var headerFooterFactory = evt.headerFooterFactory

  if (headerFooterFactory && headerFooterFactory.hasBody()) {
    headerFooterFactory.forceBodyMinHeigh()
  }
}
