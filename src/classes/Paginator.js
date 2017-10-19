'use strict'

import PaginatorPage from './PaginatorPage'
import units from '../utils/units'

export default class Paginator {
  constructor () {
    this.pages = []
    this.currentPage = null
    this.shouldCheckPageHeight = true
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
    this.pages.push(page)
  }

  getPage (pageNumber) {
    return this.pages[pageNumber - 1]
  }

  selectCurrentPage (page, type) {
    if (page && page.pageNumber) {
      this.currentPage = page
      page.setCurrentSection(page.getSectionByType(type))
    }
  }

  isCurrentPageOverflows () {
    let page = this.currentPage
    if (page && page.currentSection) {
      let section = page.currentSection
      let contentHeight = page.getSectionContentHeight()
      let format = this.currentFormat

      if (section.isBody()) {
        let maxBodyHeight = units.getValueFromStyle(format.calculateBodyHeight())
        if (contentHeight > maxBodyHeight) {
          return true
        }
      }
    }
    return false
  }

  checkBodyHeight () {
    if (this.shouldCheckPageHeight && this.isCurrentPageOverflows()) {
      this.pageOverflows(this.currentPage)
    }
  }

  pageOverflows (page) {
    console.error('Page Overflows !')
  }

  setRawPages ({pages}) {
    if (!Array.isArray(pages)) {
      throw new Error('Raw "pages" must be an array')
    }

    this.rawPages = pages
  }

  getNextPage (page) {
    let nextPage = null
    page = page || this.currentPage
    if (this.pages.length >= page.pageNumber) {
      nextPage = this.pages[page.pageNumber]
    }
    return nextPage
  }
}
