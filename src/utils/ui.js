'use strict'

/**
 * User interface module
 * @module
 * @name ui
 * @description A module to provide configured ui elements to the plugin
 */

import * as units from './units'

const $ = window.jQuery

export {$ as jQuery}

/**
 * Lock a node
 * @mixin
 * @returns {undefined}
 */
export function lockNode () {
  let $this = $(this)
  $this.attr('contenteditable', false)
  $this.addClass('unselectable')
}

/**
 * Unlock a node
 * @mixin
 * @returns {undefined}
 */
export function unlockNode () {
  let $this = $(this)
  $this.attr('contenteditable', true)
  $this.removeClass('unselectable')
  $this.focus()
}

/**
 * Create and apply the unselectable CSS class to the active document
 * @param {Editor} editor The tinymce active editor
 * @returns {undefined}
 */
export function addUnselectableCSSClass (editor) {
  const unselectableCSSRules = '.unselectable { -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }'
  let head = $('head', editor.getDoc())
  let style = $('<style>').attr('type', 'text/css').html(unselectableCSSRules)
  style.appendTo(head)
}

/**
 * Reset a menu item state
 * @param {Editor} editor The tinymce active editor
 * @param {String} selector The selector to use to DO WHAT ?
 * @TODO finish to describe the selector parameter
 */
export function resetMenuItemState (editor, selector) {
  let selectedElement = editor.selection.getStart()
  let $sel = $(selectedElement)
  let parents = $sel.parents(selector)
  this.disabled(!parents.length)
}

/**
 * Add the plugin's menu items
 */
export function autoAddMenuItems () {
  for (let itemName in this.menuItemsList) {
    this.editor.addMenuItem(itemName, this.menuItemsList[itemName])
  }
}

export function mapMceLayoutElements (bodyClass, stackedLayout) {
  stackedLayout.root = $('.' + bodyClass)
  stackedLayout.wrapper = stackedLayout.root.children('.mce-tinymce')
  stackedLayout.layout = stackedLayout.wrapper.children('.mce-stack-layout')
  stackedLayout.menubar = stackedLayout.layout.children('.mce-stack-layout-item.mce-menubar.mce-toolbar')
  stackedLayout.toolbar = stackedLayout.layout.children('.mce-stack-layout-item.mce-toolbar-grp')
  stackedLayout.editarea = stackedLayout.layout.children('.mce-stack-layout-item.mce-edit-area')
  stackedLayout.iframe = stackedLayout.editarea.children('iframe')
  stackedLayout.statusbar = {}
  stackedLayout.statusbar.wrapper = stackedLayout.layout.children('.mce-stack-layout-item.mce-statusbar')
  stackedLayout.statusbar.flowLayout = stackedLayout.statusbar.wrapper.children('.mce-flow-layout')
  stackedLayout.statusbar.path = stackedLayout.statusbar.wrapper.children('.mce-path')
  stackedLayout.statusbar.wordcount = stackedLayout.layout.children('.mce-wordcount')
  stackedLayout.statusbar.resizehandle = stackedLayout.layout.children('.mce-resizehandle')
}

export function mapPageLayoutElements (pageLayout) {
  pageLayout.pageWrapper = $('.page-wrapper')
  pageLayout.pagePanel = $('.page-panel')

  pageLayout.headerWrapper = $('.header-wrapper')
  pageLayout.headerPanel = $('.header-panel')
  setTimeout(() => {
    pageLayout.headerIframe = pageLayout.headerPanel.find('iframe')
  }, 100)

  pageLayout.bodyWrapper = $('.body-wrapper')
  pageLayout.bodyPanel = $('.body-panel')

  pageLayout.footerWrapper = $('.footer-wrapper')
  pageLayout.footerPanel = $('.footer-panel')
  setTimeout(() => {
    pageLayout.footerIframe = pageLayout.footerPanel.find('iframe')
  }, 100)
}
