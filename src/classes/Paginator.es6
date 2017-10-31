'use strict'

import PaginatorPage from './PaginatorPage'
import {jQuery as $, cutLastNode, cutLastWord} from '../utils/ui'
import {getClosestNotBookmarkParent} from '../utils/dom'

export default class Paginator {
  constructor () {
    this.pages = []
    this.currentPage = null
    this.fixPagesOverflowEnabled = true
    this.savingLastSelectionAllowed = true
    this.currentSelection = {}
    this.previousSelection = {}
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

  /**
   * Tells if the current page is overflowing or not
   * @returns {boolean} true if the current page is overflowing
   */
  isCurrentPageOverflowing () {
    const p = this.currentPage
    return p && p.currentSection && p.currentSection.isBody() && p.isOverflowing()
  }

  shouldItFixPagesOverflow () {
    return this.fixPagesOverflowEnabled
  }

  setRawPages ({pages}) {
    if (!Array.isArray(pages)) {
      throw new Error('Raw "pages" must be an array')
    }

    this.rawPages = pages
  }

  async fixPagesOverflow () {
    if (this.shouldItFixPagesOverflow()) {
      console.debug('Fixing Pages Overflow...')
      let editor = this.currentPage.currentSection.editor
      let lastNodes = []
      let $ = editor.$
      let $body = $(editor.getBody())
      this.fixPagesOverflowEnabled = false
      console.debug(`Page N°${this.currentPage.pageNumber} Overflows !`)

      // cut overflowing nodes
      while (this.isCurrentPageOverflowing()) {
        let lastNode = cutLastNode($, editor.getBody())
        lastNode && lastNodes.unshift(lastNode)
      }

      // 1. clone the last cut node,
      // 2. move the overflowing words from the original to the clone,
      // 3. re-append the original to the overflowing page
      // 4. prepend the clone to the next page
      if (lastNodes.length) {
        let lastWords = []
        let lastCutNode = lastNodes.shift()
        $body.append($(lastCutNode))
        while (this.isCurrentPageOverflowing()) {
          let lastWord = cutLastWord($, lastCutNode)
          lastWord && lastWords.unshift(lastWord)
        }

        if (lastWords.length) {
          let $splittedNodeClone = $(lastCutNode).clone()
          $splittedNodeClone.html(lastWords.join(' '))
          lastNodes.unshift($splittedNodeClone[0])
        }
      }

      if (lastNodes.length) {
        let nextPage = this.getNextPage() || await this.appendNewPage()
        let editor = nextPage.getBody().editor
        let $ = editor.$
        console.debug(`prepend ${lastNodes.length} last cut nodes in page ${nextPage.pageNumber}`, lastNodes)
        $(editor.getBody()).prepend($(lastNodes))
      }

      // re-enable page height checking (y-overflow)
      this.fixPagesOverflowEnabled = true
    }
  }

  /**
   * Append a new raw page and return a promise that listen to `HeadersFooters:NewPageAppended` then resolves the appended page number
   * @listens `HeadersFooters:NewPageAppended`
   * @fires `HeadersFooters:NewPageAppending`
   * @returns {Promise} Paginator#appendingNewPages[pageNumber]
   */
  async appendNewPage () {
    const paginator = this
    const pageNumber = this.getNumberOfPages() + 1
    const $body = window.$('body')

    this.appendingNewPages[pageNumber] = new Promise((resolve, reject) => {
      let handler = (evt, data) => {
        $body.unbind('HeadersFooters:NewPageAppended', handler)
        // resolve the new created page
        resolve(paginator.getPage(data.pageNumber))
      }
      $body.bind('HeadersFooters:NewPageAppended', handler)
      $body.trigger('HeadersFooters:NewPageAppending', { pageNumber })

      try {
        this.rawPages.push({})
      } catch (e) {
        reject(e)
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

  getCurrentPage () {
    return this.currentPage
  }

  /**
   * Save the current editor selection in the property `paginator.lastSelection`.
   * A saved selection can be restored with the method `paginator.restoreSelection()`
   * If the current selection is the same as the last saved, it returns false
   * @returns {boolean} true if a selection has been saved, else false
   */
  saveSelection () {
    let rv = false
    if (this.savingLastSelectionAllowed) {
      this.savingLastSelectionAllowed = false
      let page = this.currentPage
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
              page !== this.currentSelection.page ||
              section !== this.currentSelection.section ||
              node !== this.currentSelection.node
            ) {
              let bookmark = editor.selection.getBookmark()
              this.previousSelection = this.currentSelection
              this.currentSelection = { page, section, node, bookmark }
              rv = true
            }
          }
        }
      }
      this.savingLastSelectionAllowed = true
    }
    return rv
  }

  /**
   * Restore a selection previously saved with `paginator.saveSelection()`
   * @returns {boolean} true if a selection has been restored, else false
   */
  restoreLastSelection () {
    let pageToRestore = this.previousSelection
      ? this.previousSelection.page
      : this.currentSelection
        ? this.currentSelection.page
        : null
    if (pageToRestore && pageToRestore.isAvailable()) {
      console.error(`Restoring selection on page ${pageToRestore.pageNumber}`)
      let {page, section, bookmark} = this.previousSelection
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

  /**
   * Remove a page
   * @param {Page} removingPage The page to remove
   * @returns {Promise}
   * @fires `HeadersFooters:PageRemoving`
   * @fires `HeadersFooters:PageRemoved`
   */
  removePage (removingPage) {
    console.error(`Remove Page ${removingPage.pageNumber}`)
    let shouldRestoreSelection = false
    const removingPageNumber = removingPage.pageNumber
    const pageIndex = removingPageNumber - 1
    shouldRestoreSelection = !this.currentPage.equals(removingPage)

    $('body').trigger('HeadersFooters:PageRemoving', {pageNumber: removingPageNumber})

    return new Promise((resolve, reject) => {
      let h = removingPage.getHeader().editor
      let b = removingPage.getBody().editor
      let f = removingPage.getFooter().editor
      h.on('remove', () => {
        h.destroy()
        b.on('remove', () => {
          b.destroy()
          f.on('remove', () => {
            f.destroy()
            resolve()
          })
          f.remove()
        })
        b.remove()
      })
      h.remove()
    })
    .then(() => {
      ;[this.rawPages, this.pages].forEach(pagesArray => {
        pagesArray.splice(pageIndex, 1)
        pagesArray.forEach(page => {
          if (page.pageNumber > removingPageNumber) {
            page.pageNumber = removingPageNumber - 1
          }
        })
      })
      if (shouldRestoreSelection) {
        this.restoreLastSelection()
      } else {
        this.goToPage(this.getLastPage())
      }
      $('body').trigger('HeadersFooters:PageRemoved', {pageNumber: removingPageNumber})
    })
  }

  goToPage (page) {
    console.error(`Goto page ${page.pageNumber}`)
    this.selectCurrentPage(page, 'body')
    page.focusOnBody()
  }
}
