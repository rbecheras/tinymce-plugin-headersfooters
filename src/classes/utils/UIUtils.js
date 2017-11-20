'use strict'

import DomUtils from './DomUtils'

/**
 * The jQuery global namespace
 * @type {external:jQuery}
 */
const $ = DomUtils.jQuery

/**
 * This static class exports some useful UI functions
 * @static
 */
export default class UIUtils {
  /**
   * Lock a node
   * @mixin
   * @returns {void}
   */
  static lockNode () {
    let $this = $(this)
    $this.attr('contenteditable', false)
    $this.addClass('unselectable')
  }

  /**
   * Unlock a node
   * @mixin
   * @returns {void}
   */
  static unlockNode () {
    let $this = $(this)
    $this.attr('contenteditable', true)
    $this.removeClass('unselectable')
    $this.focus()
  }

  /**
   * Create and apply the unselectable CSS class to the active document
   * @param {Editor} editor The tinymce active editor
   * @returns {void}
   */
  static addUnselectableCSSClass (editor) {
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
  static resetMenuItemState (editor, selector) {
    let selectedElement = editor.selection.getStart()
    let $sel = $(selectedElement)
    let parents = $sel.parents(selector)
    this.disabled(!parents.length)
  }

  /**
   * Add the plugin's menu items
   */
  static autoAddMenuItems () {
    for (let itemName in this.menuItemsList) {
      this.editor.addMenuItem(itemName, this.menuItemsList[itemName])
    }
  }

  /**
   * Map the tinymce templates's layout elements
   * @param {String} bodyClass The class set to the body
   * @param {Object} stackedLayout The document paginator's stacked layout
   * @returns {void}
   * @todo Improve esdoc with examples and definition of "page layout", "mce layout", "stacked layout"
   */
  static mapMceLayoutElements (bodyClass, stackedLayout) {
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

  /**
   * Map the page layout elements
   * @param {Object} pageLayout The page's layout object
   * @returns {void}
   * @todo Improve esdoc with examples and definition of "page layout", "mce layout", "stacked layout"
   */
  static mapPageLayoutElements (pageLayout) {
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
}
