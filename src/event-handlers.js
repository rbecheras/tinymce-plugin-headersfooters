'use strict'

/**
 * This module expose the plugin event handlers
 * @module
 * @name eventHandlers
 */

var uiUtils = require('./utils/ui')

module.exports = {
  'Init': {
    setBodies: setBodies,
    setStackedLayout: setStackedLayout,
    setPageLayout: setPageLayout
  },
  'NodeChange': {},
  'SetContent': {},
  'BeforeSetContent': {},
  'Focus': {
    enterHeadFoot: enterHeadFoot
  },
  'Blur': {
    leaveHeadFoot: leaveHeadFoot
  },
  'Focus Blur Paste SetContent NodeChange HeadersFooters:SetFormat': {
    applyCurrentFormat: applyCurrentFormat
  }
}

function setBodies (evt) {
  var editor = evt.target
  this.documentBodies.mce[this.type] = editor.getBody()
  if (!this.documentBodies.app) {
    this.documentBodies.app = window.document.body
  }
  this.documentBody = editor.getBody()
}

function setStackedLayout (evt) {
  uiUtils.mapMceLayoutElements(this.bodyClass, this.stackedLayout)
}

function setPageLayout (evt) {
  if (this.isMaster) {
    uiUtils.mapPageLayoutElements(this.pageLayout)
  }
}

function enterHeadFoot (evt) {
  this.enable()
}

function leaveHeadFoot (evt) {
  this.disable()
}

function applyCurrentFormat (evt) {
  var that = this
  if (this.currentFormat) {
    // console.info('evt', that.type, evt.type)
    if (evt.type === 'blur' || evt.type === 'focus') {
      setTimeout(function () {
        that.currentFormat.applyToPlugin(that)
      }, 200)
    } else {
      that.currentFormat.applyToPlugin(that)
    }
  }
}
