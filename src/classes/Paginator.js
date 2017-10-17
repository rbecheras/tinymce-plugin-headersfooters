'use strict'

import PaginatorPage from './PaginatorPage'
import units from '../utils/units'

export default class Paginator {
  constructor () {
    this.pages = {}
    this.currentPage = null
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

  selectCurrentPage (page, type) {
    if (page && page.pageNumber) {
      this.currentPage = page
      page.setCurrentSection(page.getSectionByType(type))
    }
  }

  checkBodyHeight () {
    let page = this.currentPage
    if (page && page.currentSection) {
      let section = page.currentSection
      let contentHeight = page.getSectionContentHeight()
      let format = this.currentFormat

      if (section.isBody()) {
        let maxBodyHeight = units.getValueFromStyle(format.calculateBodyHeight())
        if (contentHeight > maxBodyHeight) {
          this.pageOverflows(this.currentPage)
        }
      }
    }
  }

  pageOverflows (page) {
    console.error('Page Overflows !')
  }
}
