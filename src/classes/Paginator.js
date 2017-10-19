'use strict'

import PaginatorPage from './PaginatorPage'
import units from '../utils/units'

export default class Paginator {
  constructor () {
    this.pages = []
    this.currentPage = null
    this.shouldCheckPageHeight = true
    this.appendingNewPages = {}
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

  /**
   * Append a new raw page and return a promise that resolves when the matching editor has init and trigger `mcePluginHeadersFooter:appendPage`
   * @returns {Promise} Paginator#appendingNewPages[pageNumber]
   */
  appendNewPage () {
    let paginator = this
    let pageNumber = this.getNumberOfPages() + 1
    this.appendingNewPages[pageNumber] = new Promise((resolve, reject) => {
      let $body = window.$('body')
      $body.bind('mcePluginHeadersFooter:appendNewPage', appendNewPageEventHandler(pageNumber))
      $body.trigger('mcePluginHeadersFooter:appendNewPage', {
        appendingStatus: 'start',
        pageNumber
      })

      try {
        this.rawPages.push({})
      } catch (e) {
        reject(e)
      }

      function appendNewPageEventHandler () {
        let handler = (evt, data) => {
          if (data.appendingStatus === 'done') {
            $('body').unbind('mcePluginHeadersFooter:appendNewPage', handler)
            // resolve the new created page
            resolve(paginator.getPage(data.pageNumber))
          }
        }
        return handler
      }
    })
    return this.appendingNewPages[pageNumber]
  }

  getNextPage (page) {
    let nextPage = null
    page = page || this.currentPage
    if (this.pages.length >= page.pageNumber) {
      nextPage = this.pages[page.pageNumber]
    }
    return nextPage
  }

  getNumberOfPages () {
    return this.pages.length
  }

  getLastPage () {
    return this.pages[this.getNumberOfPages() - 1]
  }
}
