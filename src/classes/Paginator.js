'use strict'

import PaginatorPage from './PaginatorPage'
import ui from '../utils/ui'
import units from '../utils/units'

export default class Paginator {
  constructor () {
    this.pages = []
    this.currentPage = null
    this.shouldCheckPageHeight = true
    this.shouldCheckPresenceOfALastEmptyPage = true
    this.lastSelection = {}
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
    console.info(`Page N°${page.pageNumber} Overflows !`)
    this.fixOverflow()
  }

  setRawPages ({pages}) {
    if (!Array.isArray(pages)) {
      throw new Error('Raw "pages" must be an array')
    }

    this.rawPages = pages
  }

  async fixOverflow () {
    console.info('Handle Page Overflow...')
    let editor = this.currentPage.currentSection.editor
    let lastNodes = []
    let $ = editor.$
    let $body = $(editor.getBody())
    this.shouldCheckPageHeight = false

    // cut overflowing nodes
    let stop = false
    while (!stop) {
      let lastNode = ui.cutLastNode($, editor.getBody())
      if (lastNode) {
        lastNodes.splice(0, 0, lastNode)
      }
      if (!this.isCurrentPageOverflows()) {
        stop = true
      }
    }

    // reappend the last cut node and cut its overflowing words
    if (lastNodes.length) {
      stop = false
      let lastWords = []
      let lastCutNode = lastNodes.shift()
      $body.append($(lastCutNode))
      while (!stop) {
        let lastWord = ui.cutLastWord($, lastCutNode)
        if (lastWord) {
          lastWords.splice(0, 0, lastWord)
        }
        if (!this.isCurrentPageOverflows()) {
          stop = true
        }
      }

      if (lastWords.length) {
        let $splittedNodeClone = $(lastCutNode).clone()
        $splittedNodeClone.html(lastWords.join(' '))
        lastNodes.splice(0, 0, $splittedNodeClone[0])
      }
    }

    if (lastNodes.length) {
      let nextPage = this.getNextPage() || await this.appendNewPage()
      let editor = nextPage.body.editor
      let $ = editor.$
      console.info(`prepend ${lastNodes.length} last cut nodes in page ${nextPage.pageNumber}`, lastNodes)
      $(editor.getBody()).prepend($(lastNodes))
    }

    // re-enable page height checking (y-overflow)
    this.shouldCheckPageHeight = true
  }

  /**
   * Append a new raw page and return a promise that resolves when the matching editor has init and trigger `mcePluginHeadersFooter:appendPage`
   * @returns {Promise} Paginator#appendingNewPages[pageNumber]
   */
  appendNewPage () {
    const paginator = this
    const pageNumber = this.getNumberOfPages() + 1
    const $body = window.$('body')

    this.appendingNewPages[pageNumber] = new Promise((resolve, reject) => {
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
            $body.unbind('mcePluginHeadersFooter:appendNewPage', handler)
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

  saveSelection () {
    let page, section, editor, selection
    page = this.currentPage
    if (page) {
      section = page.currentSection
      if (section) {
        editor = section.editor
        if (editor) {
          selection = editor.selection
          this.lastSelection.page = page
          this.lastSelection.section = section
          this.lastSelection.editor = editor
          this.lastSelection.selection = editor.selection
          this.lastSelection.bookmark = selection.getBookmark()
        }
      }
    }
  }

  restoreSelection () {
    if (this.lastSelection.page) {
      let {page, section, editor, selection, bookmark} = this.lastSelection
      this.selectCurrentPage(page, section.type)
      editor.focus()
      selection.moveToBookmark(bookmark)
    }
  }

  async shouldCheckPresenceOfALastEmptyPage () {
    this.saveSelection()
    this.shouldCheckPresenceOfALastEmptyPage = false
    let lastPage = this.getLastPage()
    if (lastPage.body && lastPage.body) {
      let ed = lastPage.body.editor
      let $ = ed.$
      let textContent = $(ed.getBody()).text().trim()
      console.log(`Text content of page ${lastPage.pageNumber} / ${this.getNumberOfPages()}:`, !!textContent)
      if (textContent) {
        console.log('Appending an new empty page...')
        await this.appendNewPage()
        this.restoreSelection()
        this.shouldCheckPresenceOfALastEmptyPage = true
      }
    }
  }
}
