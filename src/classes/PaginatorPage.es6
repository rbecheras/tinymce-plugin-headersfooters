'use strict'

import ui from '../utils/ui'

export default class PaginatorPage {
  constructor (pageNumber) {
    this.pageNumber = pageNumber
    this.currentSection = null
  }

  /**
   * Init a page section
   * @param {*} plugin the plugin instance specific to the page section
   * @example page.header = somePlugin
   */
  initSection (plugin) {
    this[plugin.type] = plugin
  }

  initPageLayout () {
    this.pageLayout = this.pageLayout || {
      pageWrapper: null,
      pagePanel: null,
      headerWrapper: null,
      headerPanel: null,
      bodyPanel: null,
      footerWrapper: null,
      footerPanel: null
    }
  }

  getSectionByType (type) {
    return this[type]
  }

  setCurrentSection (section) {
    this.currentSection = section
  }

  getSectionHeight () {
    return ui.getElementHeight(this.currentSection.editor.getBody(), this.currentSection.editor.getWin(), false)
  }

  getSectionContentHeight () {
    let body = this.currentSection.editor.getBody()
    if (body) {
      return body.scrollHeight
    }
  }
}
