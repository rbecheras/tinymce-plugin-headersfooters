'use strict'

import PaginatorPage from './PaginatorPage'
import {cutLastNode, cutLastWord} from '../utils/ui'
import {getClosestNotBookmarkParent} from '../utils/dom'

export default class Paginator {
  constructor () {
    this.pages = []
    this.currentPage = null
    this.shouldCheckPageHeight = true
    this.savingBookmarkAllowed = true
    this.lastSelection = {}
    this.appendingNewPages = {}
  }

  initPage (plugin, pageNumber) {
    let page = this.getPage(pageNumber)
    if (!page) {
      page = new PaginatorPage(this, pageNumber)
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
      page.setCurrentSection(page.getSection(type))
    }
  }

  isCurrentPageOverflowing () {
    let p = this.currentPage
    return p && p.currentSection && p.currentSection.isBody() && p.isOverflowing()
  }

  checkBodyHeight () {
    if (this.shouldCheckPageHeight && this.isCurrentPageOverflowing()) {
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
      let lastNode = cutLastNode($, editor.getBody())
      if (lastNode) {
        lastNodes.splice(0, 0, lastNode)
      }
      if (!this.isCurrentPageOverflowing()) {
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
        let lastWord = cutLastWord($, lastCutNode)
        if (lastWord) {
          lastWords.splice(0, 0, lastWord)
        }
        if (!this.isCurrentPageOverflowing()) {
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
      let editor = nextPage.getBody().editor
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

  /**
   * Save the current editor selection in the property `paginator.lastSelection`.
   * A saved selection can be restored with the method `paginator.restoreSelection()`
   * If the current selection is the same as the last saved, it returns false
   * @returns {boolean} true if a selection has been saved, else false
   */
  saveSelection () {
    let returnValue = false
    if (this.savingBookmarkAllowed) {
      this.savingBookmarkAllowed = false
      let page = this.currentPage
      let oldSelection = this.lastSelection
      if (page) {
        let section = page.currentSection
        if (section) {
          let editor = section.editor
          if (editor) {
            let node = getClosestNotBookmarkParent(editor.$, editor.selection.getNode())
            // @todo: préciser la sélection avec le range
            // - soit le range du bookmark selectionné dans le noeud non bookmark parent
            // - soit le range du curseur dans le noeud non bookmark parent
            // let range = editor.selection.getRng()
            if (
              page !== oldSelection.page ||
              section !== oldSelection.section ||
              node !== oldSelection.node
            ) {
              let bookmark = editor.selection.getBookmark()
              this.lastSelection = { page, section, node, bookmark }
              returnValue = true
            }
          }
        }
      }
      this.savingBookmarkAllowed = true
    }
    return returnValue
  }

  /**
   * Restore a selection previously saved with `paginator.saveSelection()`
   * @returns {boolean} true if a selection has been restored, else false
   */
  restoreSelection () {
    if (this.lastSelection.page) {
      let {page, section, bookmark} = this.lastSelection
      this.selectCurrentPage(page, section.type)
      section.editor.focus()
      section.editor.selection.moveToBookmark(bookmark)
      return true
    }
    return false
  }

  removePageByNumber (pageNumber) {
    return this.removePage(this.getPage(pageNumber))
  }

  removePage (removingPage) {
    console.error(`Remove Page ${this.pageNumber}`)
    const removingPageNumber = removingPage.pageNumber
    const pageIndex = removingPageNumber - 1
    ;[this.rawPages, this.pages].forEach(pagesArray => {
      pagesArray.splice(pageIndex, 1)
      pagesArray.forEach(page => {
        if (page.pageNumber > removingPageNumber) {
          page.pageNumber = removingPageNumber - 1
        }
      })
    })
  }
}
