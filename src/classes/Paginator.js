'use strict'

import PaginatorPage from './PaginatorPage'

export default class Paginator {
  constructor () {
    this.pages = {}
  }

  initPage (plugin, pageNumber) {
    let page = this.getPage(pageNumber)
    if (!page) {
      page = new PaginatorPage(pageNumber)
      this.addPage(page)
    }
    page.initSection(plugin)
    page.initPageLayout()
    return page
  }

  addPage (page) {
    this.pages[page.pageNumber] = page
  }

  getPage (pageNumber) {
    return this.pages[pageNumber]
  }
}
