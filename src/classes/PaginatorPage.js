'use strict'

export default class PaginatorPage {
  constructor (pageNumber) {
    this.pageNumber = pageNumber
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
}
