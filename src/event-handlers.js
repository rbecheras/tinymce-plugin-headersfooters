'use strict'

/**
 * This module expose the plugin event handlers
 * @module
 * @name eventHandlers
 */

import UIUtils from './classes/utils/UIUtils'
import DomUtils from './classes/utils/DomUtils'

/**
 * jQuery global namespace
 * @type {external:jQuery}
 */
const $ = DomUtils.jQuery

/**
 * Tinymce global namespace
 * @type {external:tinymce}
 */
const tinymce = window.tinymce

/**
 * @ignore
 */
export const eventHandlers = {
  'Init': { setBodies, setStackedLayout, setPageLayout, configureSectionButtonBar, reloadMenuItems, firesNewPageAppendedEvent, initHeadFootContent },
  'Change': { syncHeadFoot, checkPageOverflow },
  'NodeChange': { checkPageOverflowOnNodeChange },
  'BeforeSetContent': {},
  'Focus': { enterHeadFoot, selectCurrentPage },
  'Blur': { leaveHeadFoot },
  'KeyDown': { moveCursorToNeededPage, removePageIfEmptyAndNotFirst },
  'Focus Blur Paste SetContent NodeChange HeadersFooters:SetFormat': { applyCurrentFormat, reloadMenuItems },
  'HeadersFooters:Error:NegativeBodyHeight': { alertErrorNegativeBodyHeight }
}

/**
 * @ignore
 */
export const debugEventHandlers = {
  'KeyDown KeyPress KeyUp': { logKeyPress },
  'ExecCommand': { logExecCommand }
}

/**
 * @ignore
 */
export const mainBodyEventHandlers = {
  'HeadersFooters:NewPageAppending': {},
  'HeadersFooters:NewPageAppended': {}
}

export {eventHandlers as default}

/**
 * Fires the `HeadersFooters:NewPageAppended` event to the main body on the main frame of the whole app, not to an editor iframe.
 * @param evt {Event}
 * @fires `HeadersFooters:NewPageAppended`
 * @returns {void}
 */
function firesNewPageAppendedEvent (evt) {
  if (this.editor.settings.headersfooters_type === 'body') {
    $('body').trigger('HeadersFooters:NewPageAppended', {
      sectionType: this.editor.settings.headersfooters_type,
      pageNumber: this.editor.settings.headersfooters_pageNumber
    })
  }
}

/**
 * Set document bodies on editor init
 * @param {Event} evt the Init event
 * @returns {void}
 */
function setBodies (evt) {
  const editor = evt.target
  this.documentBodies.mce[this.type] = editor.getBody()
  if (!this.documentBodies.app) {
    this.documentBodies.app = window.document.body
  }
  this.documentBody = editor.getBody()
}

/**
 * Set the stacked layout on editor init
 * @param {Event} evt the Init event
 * @returns {void}
 */
function setStackedLayout (evt) {
  UIUtils.mapMceLayoutElements(this.bodyClass, this.stackedLayout)
}

/**
 * Set the page layout on editor init
 * @param {Event} evt the Init event
 * @returns {void}
 */
function setPageLayout (evt) {
  this.isMaster() && UIUtils.mapPageLayoutElements(this.page.pageLayout)
}

/**
 * Configure the section's (header or footer only) button bar on editor init
 * @param {Event} evt the Init event
 * @returns {void}
 */
function configureSectionButtonBar (evt) {
  if (this.isHeader()) {
    setTimeout(() => {
      try {
        this.configureHeaderButtonBar()
      } catch (e) {
        console.error('Unable to configure the header button bar', e)
      }
    }, 3000)
  }
  if (this.isFooter()) {
    setTimeout(() => {
      try {
        this.configureFooterButtonBar()
      } catch (e) {
        console.error('Unable to configure the footer button bar', e)
      }
    }, 3000)
  }
}

/**
 * Enter into the section (header, body or footer) on Focus
 * @param {Event} evt The Focus event
 * @returns {void}
 */
function enterHeadFoot (evt) {
  this.enableEditorUI()
  this.paginator.pages.forEach(page => {
    page.iterateOnSections((section) => {
      if (this.type === section.type) {
        section.enableEditableArea()
        if (!this.page.equals(section.page)) {
          section.unselectContent()
        }
      } else {
        section.disableEditableArea()
      }
    })
  })
}

/**
 * Leave the current HeadFoot instance on editor Blur unless it is a body section
 * NB: here, `this` is the plugin instance
 * @param {Event} evt The Blur event
 * @returns {void}
 */
function leaveHeadFoot (evt) {
  if (this.paginator) {
    setTimeout(() => {
      // Is the active section focused (after 50ms ?)
      let activeSection = this.paginator.getActiveSection()
      if (activeSection.hasFocus()) {
        // disable all sections of a different type
        let typeOfSectionsToEnable = activeSection.type
        this.paginator.pages.forEach(page => {
          page.iterateOnSections(section => {
            if (!section.isOfType(typeOfSectionsToEnable)) {
              section.disableEditableArea()
              section.disableEditorUI()
            }
          })
        })
      } else {
        // enable all body sections
        this.paginator.pages.forEach(page => page.getBody().enableEditableArea())
        // enable the editor UI of the body on the blured page
        this.page.getBody().enableEditorUI()
        // and focus on the body on the blured page
        this.page.getBody().editor.focus()
      }
    }, 50)
  }
}

/**
 * Apply the current format:
 * - on editor Focus Blur Paste SetContent NodeChange
 * - and on HeadersFooters:SetFormat
 * @param {Event} evt The event object
 */
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

/**
 * Set document bodies:
 * - on editor Init, Focus, Blur, Paste, SetContent, NodeChange
 * - and on window.body HeadersFooters:SetFormat
 * @param {Event} evt the Init event
 * @returns {void}
 */
function reloadMenuItems (evt) {
  const {plugin} = _getActiveContext()
  if (plugin) {
    plugin.reloadMenuItems()
  }
}

/**
 * Select the current page and reload the menu items of the matching editor on editor Focus
 * @param {Event} evt The Focus event
 * @returns {void}
 */
function selectCurrentPage (evt) {
  const {paginator, page, plugin} = _getActiveContext()
  if (plugin && paginator && page) {
    paginator.selectCurrentPage(page, plugin.type)
    plugin.reloadMenuItems()
  }
}

/**
 * Check page overflow on Change
 * @param {Event} evt the Change event
 * @returns {void}
 */
function checkPageOverflow (evt) {
  const {paginator, page} = _getActiveContext()
  if (paginator && page && paginator.shouldItFixPagesOverflow()) {
    paginator.fixPagesOverflow()
  }
}

/**
 * Check page overflow on NodeChange but do not check empty spaces `fixPagesOverflow(true)`
 * @param {Event} evt the NodeChange event
 * @returns {void}
 */
function checkPageOverflowOnNodeChange (evt) {
  const {paginator, page} = _getActiveContext()
  if (paginator && page && paginator.shouldItFixPagesOverflow()) {
    paginator.fixPagesOverflow(true)
  }
}

/**
 * Remove a page on KeyDown if it is empty and if it is not the first (and if the KeyDown is backspace)
 * @param {Event} evt The KeyDown event
 */
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

/**
 * Move the cursor to the needed page on keydown
 * @param {Event} evt The KeyDown event
 * @returns {void}
 */
function moveCursorToNeededPage (evt) {
  const {key, keyCode, altKey, ctrlKey} = evt
  if (key === 'ArrowDown' && keyCode === 40 && !altKey && !ctrlKey) {
    const {plugin} = _getActiveContext()
    if (plugin && plugin.isBody()) {
      console.error('moveCursorToNeededPage')
    }
  }
}

/**
 * Logs the KeyPress event in debug mode
 * @param {Event} evt The KeyPress event
 * @param {Object} data The event data
 * @returns {void}
 */
function logKeyPress (evt, data) {
  console.log(`Keyboard pressed (${evt.type})`, evt, data)
}

/**
 * Logs the ExecCommand event in debug mode
 * @param {Event} evt The ExecCommand event
 * @param {Object} data The event data
 * @returns {void}
 */
function logExecCommand (evt, data) {
  console.log(`Command executing (${evt.command})`, evt, data)
}

/**
 * Get back a hash of useful object references depending of the active editor's context.
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

/**
 * Sync all the headers or all the footers on each pages on Change event.
 * @param {Event} evt The Change event
 * @returns {void}
 */
function syncHeadFoot (evt) {
  if (this.paginator && this.paginator.shouldItSyncHeadFootContent()) {
    if (this.isHeader() || this.isFooter()) {
      this.paginator.syncHeadFootContent(this)
    }
  }
}

/**
 * Initialize the content of the header or the footer on editor Init
 * @param {Event} evt The Init event object
 * @returns {void}
 */
function initHeadFootContent (evt) {
  if (this.isHeader() || this.isFooter()) {
    if (this.paginator) {
      let firstPage = this.paginator.getPage(1)
      this.editor.setContent(firstPage.getSection(this.type).editor.getContent())
    }
  }
}
