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
    setPageLayout: setPageLayout,
    reloadMenuItems: reloadMenuItems
  },
  'NodeChange': {
    checkBodyHeight: checkBodyHeight
  },
  'SetContent': {},
  'BeforeSetContent': {},
  'Focus': {
    enterHeadFoot: enterHeadFoot,
    selectCurrentPage: selectCurrentPage
  },
  'Blur': {
    leaveHeadFoot: leaveHeadFoot
  },
  'Focus Blur Paste SetContent NodeChange HeadersFooters:SetFormat': {
    applyCurrentFormat: applyCurrentFormat,
    reloadMenuItems: reloadMenuItems
  },
  'HeadersFooters:Error:NegativeBodyHeight': {
    alertErrorNegativeBodyHeight: alertErrorNegativeBodyHeight
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
  if (this.isMaster()) {
    uiUtils.mapPageLayoutElements(this.page.pageLayout)
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
  if (this.paginator.currentFormat) {
    // console.info('evt', that.type, evt.type)
    if (evt.type === 'blur' || evt.type === 'focus') {
      setTimeout(function () {
        that.paginator.currentFormat.applyToPlugin(that)
      }, 200)
    } else {
      that.paginator.currentFormat.applyToPlugin(that)
    }
  }
}

/**
 * @param {Event} evt HeadersFooters:Error:NegativeBodyHeight event
 * @TODO document setting `editor.settings.SILENT_INCONSISTANT_FORMAT_WARNING`
 * @TODO document event `HeadersFooters:Error:NegativeBodyHeight`
 */
function alertErrorNegativeBodyHeight (evt) {
  var editor = evt.target
  if (!editor.settings.SILENT_INCONSISTANT_FORMAT_WARNING) {
    // editor.execCommand('editFormatCmd')
    // throw new Error('Inconsistant custom format: body height is negative. Please fix format properties')
    console.error('Inconsistant custom format: body height is negative. Please fix format properties')
  }
}

function reloadMenuItems (evt) {
  var editor = evt.target
  if (editor && editor.plugins && editor.plugins.headersfooters) {
    editor.plugins.headersfooters.reloadMenuItems()
  }
}

function selectCurrentPage (evt) {
  let editor = evt.target
  let plugin = editor.plugins.headersfooters
  let paginator, page
  if (editor && plugin) {
    paginator = plugin.paginator
    page = plugin.page
    if (paginator && page) {
      paginator.selectCurrentPage(page)
      editor.plugins.headersfooters.reloadMenuItems()
    }
  }
}

function checkBodyHeight (evt) {
  let editor = evt.target
  let plugin = editor.plugins.headersfooters
  let paginator, page
  if (editor && plugin) {
    paginator = plugin.paginator
    page = plugin.page
    if (paginator && page) {
      paginator.checkBodyHeight()
    }
  }
}
