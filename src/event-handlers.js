'use strict'

/**
 * This module expose the plugin event handlers
 * @module
 * @name eventHandlers
 */

import {mapPageLayoutElements, mapMceLayoutElements} from './utils/ui'

const tinymce = window.tinymce
const $ = window.jQuery

export const eventHandlers = {
  'Init': { setBodies, setStackedLayout, setPageLayout, reloadMenuItems, firesNewPageAppendedEvent },
  'NodeChange': { checkPageOverflow, bookmarkSelection },
  'SetContent': {},
  'BeforeSetContent': {},
  'Focus': { enterHeadFoot, selectCurrentPage },
  'Blur': { leaveHeadFoot },
  'KeyDown': { moveCursorToNeededPage, removePageIfEmptyAndNotFirst },
  'Focus Blur Paste SetContent NodeChange HeadersFooters:SetFormat': { applyCurrentFormat, reloadMenuItems },
  'HeadersFooters:Error:NegativeBodyHeight': { alertErrorNegativeBodyHeight }
}

export const debugEventHandlers = {
  'KeyDown KeyPress KeyUp': { logKeyPress },
  'ExecCommand': { logExecCommand }
}

export const mainBodyEventHandlers = {
  'HeadersFooters:NewPageAppending': {},
  'HeadersFooters:NewPageAppended': {}
}

export {eventHandlers as default}

/**
 * Fires the `HeadersFooters:NewPageAppended` event to the main body on the main frame of the whole app, not to an editor iframe.
 * @param evt {Event}
 * @fires `HeadersFooters:NewPageAppended`
 */
function firesNewPageAppendedEvent (evt) {
  if (this.editor.settings.headersfooters_type === 'body') {
    $('body').trigger('HeadersFooters:NewPageAppended', {
      sectionType: this.editor.settings.headersfooters_type,
      pageNumber: this.editor.settings.headersfooters_pageNumber
    })
  }
}

function setBodies (evt) {
  const editor = evt.target
  this.documentBodies.mce[this.type] = editor.getBody()
  if (!this.documentBodies.app) {
    this.documentBodies.app = window.document.body
  }
  this.documentBody = editor.getBody()
}

function setStackedLayout (evt) {
  mapMceLayoutElements(this.bodyClass, this.stackedLayout)
}

function setPageLayout (evt) {
  this.isMaster() && mapPageLayoutElements(this.page.pageLayout)
}

function enterHeadFoot (evt) {
  this.paginator.pages.forEach(page => {
    page.iterateOnSections((section) => {
      if (this.type === section.type) {
        section.enable()
      } else {
        section.disable()
      }
    })
  })
}

/**
 * Leave the current HeadFoot instance unless it is a body section
 * NB: here, `this` is the plugin instance
 * @param evt
 */
function leaveHeadFoot (evt) {
  this.paginator.pages.forEach(page => {
    setTimeout(() => {
      let atLeastOneEnabled = false
      this.page.iterateOnSections((section) => {
        !this.isBody() && this.type === section.type && section.disable()
        section.enabled && (atLeastOneEnabled = true)
      })
      !atLeastOneEnabled && this.page.getBody().enable()
    }, 50)
  })
}

function applyCurrentFormat (evt) {
  const {plugin, paginator} = _getActiveContext()
  if (plugin && paginator && paginator.currentFormat) {
    if (evt.type === 'blur' || evt.type === 'focus') {
      setTimeout(function () {
        paginator.currentFormat.applyToPlugin(plugin)
      }, 200)
    } else {
      paginator.currentFormat.applyToPlugin(plugin)
    }
  }
}

/**
 * @param {Event} evt HeadersFooters:Error:NegativeBodyHeight event
 * @TODO document setting `editor.settings.SILENT_INCONSISTANT_FORMAT_WARNING`
 * @TODO document event `HeadersFooters:Error:NegativeBodyHeight`
 */
function alertErrorNegativeBodyHeight (evt) {
  const {editor} = _getActiveContext()
  if (!editor.settings.SILENT_INCONSISTANT_FORMAT_WARNING) {
    // editor.execCommand('editFormatCmd')
    // throw new Error('Inconsistant custom format: body height is negative. Please fix format properties')
    console.error('Inconsistant custom format: body height is negative. Please fix format properties')
  }
}

function reloadMenuItems (evt) {
  const {plugin} = _getActiveContext()
  if (plugin) {
    plugin.reloadMenuItems()
  }
}

function selectCurrentPage (evt) {
  const {paginator, page, plugin} = _getActiveContext()
  if (plugin && paginator && page) {
    paginator.selectCurrentPage(page, plugin.type)
    plugin.reloadMenuItems()
  }
}

function checkPageOverflow (evt) {
  const {paginator, page} = _getActiveContext()
  if (paginator && page && paginator.shouldItFixPagesOverflow()) {
    if (page.isOverflowing()) {
      paginator.fixPagesOverflow()
    }
  }
}

function removePageIfEmptyAndNotFirst (evt) {
  const {key, keyCode, altKey, ctrlKey} = evt
  if (key === 'Backspace' && keyCode === 8 && !altKey && !ctrlKey) {
    const {plugin, page, section} = _getActiveContext()
    if (plugin && plugin.isBody()) {
      if (page && page.pageNumber > 1) {
        let isBody = section.isBody()
        let isEmpty = page.isEmpty()
        if (isBody && isEmpty) {
          plugin.paginator.removePage(page)
        }
      }
    }
  }
}

function moveCursorToNeededPage (evt) {
  const {key, keyCode, altKey, ctrlKey} = evt
  if (key === 'ArrowDown' && keyCode === 40 && !altKey && !ctrlKey) {
    const {plugin} = _getActiveContext()
    if (plugin && plugin.isBody()) {
      console.error('moveCursorToNeededPage')
    }
  }
}

function logKeyPress (evt, data) {
  console.log(`Keyboard pressed (${evt.type})`, evt, data)
}

function logExecCommand (evt, data) {
  console.log(`Command executing (${evt.command})`, evt, data)
}

function bookmarkSelection (evt, data) {
  const {paginator} = _getActiveContext()
  paginator && paginator.saveLastSelection()
}

/**
 * Get back a hash of useful object references depending of the active editor's context.
 * @function
 * @inner
 * @returns {object} a hash filled with the following references: `{editor, plugin, paginator, page, currentPage, section}`
 */
function _getActiveContext () {
  const editor = tinymce.activeEditor
  const plugin = editor ? editor.plugins.headersfooters : null
  const paginator = plugin ? plugin.paginator : null
  const page = plugin ? plugin.page : null
  const currentPage = paginator ? paginator.currentPage : null
  const section = page ? page.currentSection : null
  return {editor, plugin, paginator, page, currentPage, section}
}
