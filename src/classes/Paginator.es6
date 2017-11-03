'use strict'

import PaginatorPage from './PaginatorPage'
import {jQuery as $, cutLastNode, cutLastWord} from '../utils/ui'
import {getClosestNotBookmarkParent} from '../utils/dom'

/**
 * Class Paginator
 * @property {array<PaginatorPage>} pages the list of paginated pages
 * @property {PaginatorPage} currentPage the current selected page (the user is working on it)
 * @property {boolean} fixPagesOverflowEnabled the action of the method fixPagesOverflow() is disabled (do nothing) if this property is on false
 * @property {boolean} saveLastSelectionsEnabled the action of the method saveLastSelections() is disabled (do nothing) if this property is on false
 * @property {object} currentSelection the current selection (saved by saveLastSelections())
 * @property {object} previousSelection the previous selection (saved by saveLastSelections())
 * @property {object} appendingNewPages a hash of promises resolved by the appended page number when the page is appended
 * @listens `HeadersFooters:NewPageAppended`
 * @fires `HeadersFooters:NewPageAppending`
 * @fires `HeadersFooters:PageRemoving`
 * @fires `HeadersFooters:PageRemoved`
 */
export default class Paginator {
  constructor () {
    this.pages = []
    this.currentPage = null
    this.fixPagesOverflowEnabled = true
    this.saveLastSelectionsEnabled = true
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

  shouldItFixPagesOverflow () {
    return this.fixPagesOverflowEnabled
  }

  shouldItSaveLastSelections () {
    return this.saveLastSelectionsEnabled
  }

  setRawPages ({pages}) {
    if (!Array.isArray(pages)) {
      throw new Error('Raw "pages" must be an array')
    }

    this.rawPages = pages
  }

  /**
   * Enable or disable the action of paginator.fixPagesOverflow()
   * @param {boolean} bool pass true to enable and false to disable
   * @returns {undefined}
   */
  enableFixPagesOverflow (bool) {
    if (typeof bool !== 'boolean') throw new TypeError('first argument must be a boolean to enable or disable the feature')
    this.fixPagesOverflowEnabled = !!bool
  }

  /**
   * Enable or disable the action of paginator.saveLastSelection()
   * @param {boolean} bool pass true to enable and false to disable
   * @returns {undefined}
   */
  enableSaveLastSelections (bool) {
    if (typeof bool !== 'boolean') throw new TypeError('first argument must be a boolean to enable or disable the feature')
    this.saveLastSelectionsEnabled = !!bool
  }

  /**
   * Fix all overflowing pages starting at the current active page to the last.
   * Loop recursively over the nested overflowing nodes to split and clone it and past overflowing content to the next page.
   * @see {@link https://github.com/zenorocha/clipboard.js/issues/250}
   */
  async fixPagesOverflow () {
    if (this.shouldItFixPagesOverflow()) {
      console.debug('Fixing Pages Overflow...')
      this.enableFixPagesOverflow(false)
      for (let i = this.getCurrentPage().pageNumber; i <= this.getNumberOfPages(); i++) {
        let page = this.getPage(i)
        if (page.isOverflowing()) {
          let section = page.getBody()
          let editor = section.editor
          let overflowingBodyClone = fixOverflowAndGetAsClonedNode(page, editor.getBody())
          let overflowingNodes = editor.$(overflowingBodyClone).children()

          if (overflowingNodes.length) {
            let nextPage = this.getNextPage(page) || await this.appendNewPage()
            let editor = nextPage.getBody().editor
            let $ = editor.$
            console.debug(`prepend ${overflowingNodes.length} last cut nodes in page ${nextPage.pageNumber}`, overflowingNodes)
            $(editor.getBody()).prepend(overflowingNodes)
          }
        }
      }
      // re-enable page height checking (y-overflow)
      this.enableFixPagesOverflow(true)
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
  saveLastSelection () {
    let rv = false
    if (this.saveLastSelectionsEnabled) {
      this.enableSaveLastSelections(false)
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
      this.enableSaveLastSelections(true)
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
  async removePage (removingPage) {
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

/**
 * Remove the overflowing content of an overflowing element and returns the rest as a clone of the given element containing only the overflowing content.
 * Caution: this is not a pure function! parentElement will be altered: the content oveflowing the page will be removed.
 * @param {PaginatorPage} page the page containing the parent element, currently overflowing it
 * @param {HTMLElement} parentElement the parent element currently overflowing that should be splitted/cloned between the given page (the overflowing page) and the next page
 * @returns {HTMLElement} a clone of `parentElement` containing
 */
function fixOverflowAndGetAsClonedNode (page, parentElement) {
  let editor = page.getBody().editor
  let $ = editor.$
  let splittedNode
  let splittedNodeClone
  let overflowingNodes = []
  let overflowingWords = []

  let $parentElement = $(parentElement)
  let parentElementChildren = $parentElement.children()
  let $parentElementClone = $parentElement.clone().empty()

  if (parentElementChildren.length) {
    let resume = 0
    while (page.isOverflowing() && resume < 100) {
      let lastNode = cutLastNode($, parentElement)
      if (lastNode) {
        overflowingNodes.unshift(lastNode)
      }
      resume++
    }
    if (resume === 999) {
      console.error('cutLastNode loop reached out 100 iteration !')
    }

    if (overflowingNodes.length) {
      splittedNode = overflowingNodes.shift()
      $parentElement.append(splittedNode)
      splittedNodeClone = fixOverflowAndGetAsClonedNode(page, splittedNode)
      overflowingNodes.unshift(splittedNodeClone)
      $parentElementClone.append(overflowingNodes)
    }
  } else {
    let resume = 0
    while (page.isOverflowing() && resume < 100) {
      let lastWord = cutLastWord($, parentElement)
      if (lastWord) {
        overflowingWords.unshift(lastWord)
      }
      resume++
    }
    if (resume === 999) {
      console.error('cutLastNode loop reached out 100 iteration !')
    }

    if (overflowingWords.length) {
      $parentElementClone.text(overflowingWords.join(' '))
    }
  }

  return $parentElementClone
}
