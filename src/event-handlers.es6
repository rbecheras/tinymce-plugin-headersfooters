'use strict'

/**
 * This module expose the plugin event handlers
 * @module
 * @name eventHandlers
 */

const uiUtils = require('./utils/ui')
const tinymce = window.tinymce

const eventHandlers = {
  'Init': { setBodies, setStackedLayout, setPageLayout, reloadMenuItems },
  'NodeChange': { checkBodyHeight },
  'SetContent': {},
  'BeforeSetContent': {},
  'Focus': { enterHeadFoot, selectCurrentPage },
  'Blur': { leaveHeadFoot },
  'KeyDown': { moveCursorToNeededPage, removePageIfEmptyAndNotFirst },
  'Focus Blur Paste SetContent NodeChange HeadersFooters:SetFormat': { applyCurrentFormat, reloadMenuItems },
  'HeadersFooters:Error:NegativeBodyHeight': { alertErrorNegativeBodyHeight }
}

const debugEventHandlers = {
  'KeyDown KeyPress KeyUp': { logKeyPress },
  'ExecCommand': { logExecCommand }
}

export {eventHandlers as default, eventHandlers, debugEventHandlers}

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
      paginator.selectCurrentPage(page, plugin.type)
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

function removePageIfEmptyAndNotFirst (evt) {
  const {key, keyCode, altKey, ctrlKey} = evt
  if (key === 'Backspace' && keyCode === 8 && !altKey && !ctrlKey) {
    const editor = tinymce.activeEditor
    const plugin = editor.plugins.headersfooters
    if (plugin.isBody()) {
      const page = plugin.paginator.currentPage
      const section = page.currentSection
      if (page.pageNumber !== 1 && section.isBody() && page.isEmpty()) {
        plugin.paginator.removePage(page)
      }
    }
  }
}

function moveCursorToNeededPage (evt) {
  const {key, keyCode, altKey, ctrlKey} = evt
  if (key === 'ArrowDown' && keyCode === 8 && !altKey && !ctrlKey) {
    const editor = tinymce.activeEditor
    const plugin = editor.plugins.headersfooters
    if (plugin.isBody()) {
      plugin.paginator.removeCurrentPageIfEmptyAndNotFirst()
    }
  }
}

function logKeyPress (evt, data) {
  console.log(`Keyboard pressed (${evt.type})`, evt, data)
}

function logExecCommand (evt, data) {
  console.log(`Command executing (${evt.command})`, evt, data)
}

function _getContext () {
  const editor = tinymce.activeEditor
  const plugin = editor ? editor.plugins.headersfooters : null
  const paginator = plugin ? plugin.paginator : null
  const page = plugin ? plugin.page : null
  const currentPage = paginator ? paginator.currentPage : null
  const section = page ? page.currentSection : null
  return {editor, plugin, paginator, page, currentPage, section}
}