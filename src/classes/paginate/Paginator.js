'use strict'

import PaginatorPage from './PaginatorPage'
import DomUtils from '../utils/DomUtils'
// import TimeUtils from '../utils/TimeUtils'

/**
 * The global jQuery instance
 * @type {external:jQuery}
 */
const $ = DomUtils.jQuery

/**
 * Tinymce global namespace
 * @type {external:tinymce}
 */
const tinymce = window.tinymce

/**
 * The class Paginator is instanciated as a singleton to instantiate all pages, store each one in a collection and provide all the methods to handle the pagination.
 * @listens `HeadersFooters:NewPageAppended` on window.body element
 * @fires `HeadersFooters:NewPageAppending` on window.body element
 * @fires `HeadersFooters:PageRemoving` on window.body element
 * @fires `HeadersFooters:PageRemoved` on window.body element
 */
export default class Paginator {
  /**
   * Create a new paginator instance
   * @returns {void}
   * @example
   * let paginator = new Paginator()
   */
  constructor () {
    /**
     * The document's pages collection
     * @type {Array<PaginatorPage>}
     */
    this.pages = []

    /**
     * The document's raw pages collection
     * @type {Array<Object>}
     */
    this.rawPages = []

    /**
     * The current selected page (the user is working on it)
     * @type {PaginatorPage}
     */
    this.currentPage = null

    /**
     * The action of the method fixPagesOverflow() is disabled (do nothing) if this property is on false
     * @type {Boolean}
     */
    this.fixPagesOverflowEnabled = true

    /**
     * The action of the method saveLastSelections() is disabled (do nothing) if this property is on false
     * @type {Boolean}
     */
    this.saveLastSelectionsEnabled = true

    /**
     * The action of the method syncHeadFoot() is disabled (do nothing) if this property is on false
     * @type {Boolean}
     */
    this.syncHeadContentFootEnabled = true

    /**
     * The current selection (saved by saveLastSelections())
     * @type {Object}
     */
    this.currentSelection = {}

    /**
     * The previous selection (saved by saveLastSelections())
     * @type {Object}
     */
    this.previousSelection = {}

    /**
     * A hash of promises resolved by the appended page number when the page is appended
     * @type {Object}
     */
    this.appendingNewPages = {}
  }

  /**
   * Initialize a new page given a plugin instance and a page number.
   * @param {HeadersFootersPlugin} plugin The headersfooters plugin instance
   * @param {Number} pageNumber The page number
   * @returns {PaginatorPage} The initialized page
   */
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

  /**
   * Add a new page to the paginator.
   * @param {PaginatorPage} page The page to add to the paginator
   * @returns {void}
   */
  addPage (page) {
    this.pages.push(page)
  }

  /**
   * Get a page reference by its page number.
   * @param {Number} pageNumber The wanted page number.
   * @returns {PaginatorPage} The wanted page having the `pageNumber` page number.
   */
  getPage (pageNumber) {
    return this.pages[pageNumber - 1]
  }

  /**
   * Select a given page as the new current page and set the current section following the given `type`.
   * @param {PaginatorPage} page The page to select as the current page.
   * @param {String} type The section type to set as the current section.
   * @returns {void}
   */
  selectCurrentPage (page, type) {
    if (page && page.pageNumber) {
      this.currentPage = page
      page.setCurrentSection(page.getSection(type))
    }
  }

  /**
   * Tells if it shoult fix the pages overflow or not.
   * @returns {Boolean} True if it should fix the pages overflow, else false.
   */
  shouldItFixPagesOverflow () {
    return this.fixPagesOverflowEnabled
  }

  /**
   * Tells if it should save the lasts selections or not.
   * @returns {Boolean} True if it shoud save it, else false.
   */
  shouldItSaveLastSelections () {
    return this.saveLastSelectionsEnabled
  }

  /**
   * Tells if it should sync the headers/footers in function of the last updated or not.
   * @returns {Boolean} True if it shoud sync, else false.
   */
  shouldItSyncHeadFootContent () {
    return this.syncHeadContentFootEnabled
  }

  /**
   * Set the raw pages list: the input data provided as initial pages content on editors init.
   * @param {Object} param0 An object containing a `pages` property.
   * @param {Array<Object>} param0.pages The list of raw pages to init in paginator.
   */
  setRawPages ({pages}) {
    if (!Array.isArray(pages)) {
      throw new Error('Raw "pages" must be an array')
    }

    this.rawPages = pages
  }

  /**
   * Enable or disable the action of paginator.fixPagesOverflow()
   * @param {boolean} bool pass true to enable and false to disable
   * @returns {void}
   */
  enableFixPagesOverflow (bool) {
    if (typeof bool !== 'boolean') throw new TypeError('first argument must be a boolean to enable or disable the feature')
    this.fixPagesOverflowEnabled = !!bool
  }

  /**
   * Enable or disable the action of paginator.saveLastSelection()
   * @param {boolean} bool pass true to enable and false to disable
   * @returns {void}
   */
  enableSaveLastSelections (bool) {
    if (typeof bool !== 'boolean') throw new TypeError('first argument must be a boolean to enable or disable the feature')
    this.saveLastSelectionsEnabled = !!bool
  }

  /**
   * Enable or disable the action of paginator.syncHeadFoot()
   * @param {boolean} bool pass true to enable and false to disable
   * @returns {void}
   */
  enableSyncHeadFootContent (bool) {
    if (typeof bool !== 'boolean') throw new TypeError('first argument must be a boolean to enable or disable the feature')
    this.syncHeadContentFootEnabled = !!bool
  }

  /**
   * Fix all overflowing pages starting at the current active page to the last.
   * Loop recursively over the nested overflowing nodes to split and clone it and past overflowing content to the next page.
   * @see {@link https://github.com/zenorocha/clipboard.js/issues/250}
   * @returns {void}
   */
  async fixPagesOverflow () {
    if (this.shouldItFixPagesOverflow() && this.getCurrentPage()) {
      this.enableFixPagesOverflow(false)
      let currentPage = this.getCurrentPage()
      let currentSection = currentPage.getBody()
      let currentEditor = currentSection.editor
      // let selectedRange = currentEditor.selection.getRng()

      if (currentPage.isOverflowing()) {
        for (let i = currentPage.pageNumber; i <= this.getNumberOfPages(); i++) {
          let page = this.getPage(i)
          let section = page.getBody()
          let editor = section.editor

          if (page.isOverflowing()) {
            let overflowingBodyClone = null
            let overflowingNodes = null

            await DomUtils.editorTransactAsync(editor, async () => {
              overflowingBodyClone = await fixOverflowAndGetAsClonedNode(page, editor.getBody())
              // console.log(`Cloned/Splitted node between pages ${page.pageNumber} and ${page.pageNumber + 1}`, overflowingBodyClone)
              overflowingNodes = editor.$(overflowingBodyClone).children()
            })

            if (overflowingNodes.length) {
              let nextPage = this.getNextPage(page) || await this.appendNewPage(true)
              let editor = nextPage.getBody().editor
              let $ = editor.$
              editor.undoManager.transact(() => {
                // console.log(`Prepend ${overflowingNodes.length} last cut nodes in page ${nextPage.pageNumber}`, overflowingNodes)
                $(editor.getBody()).prepend(overflowingNodes)
                editor.nodeChanged()
              })
            }
          }
        }
      } else if (currentPage.isEmpty()) {
        this.removePage(currentPage)
      } else {
        for (let i = currentPage.pageNumber; i <= this.getNumberOfPages(); i++) {
          let page = this.getPage(i)
          let section = page.getBody()
          let editor = section.editor

          if (this.hasNextPage(page)) {
            let nextPage = this.getNextPage(page)
            let nextPageSection = nextPage.getBody()
            if (nextPageSection && nextPageSection.editor) {
              let nextPageEditor = nextPageSection.editor
              let nextPageBody = nextPageEditor.getBody()
              while (!page.isOverflowing() && !nextPage.isEmpty()) {
                let firstNode = DomUtils.cutFirstNode(nextPageEditor.$, nextPageBody)
                if (firstNode) {
                  // console.log(`Appending node to page ${page.pageNumber}`, firstNode)
                  $(editor.getBody()).append(firstNode)
                }
              }
            }
          }
        }
        setTimeout(() => {
          try {
            currentEditor.nodeChanged()
            currentSection.enableEditorUI()
            currentEditor.focus()
          } catch (e) {
            console.error(e)
          }
        }, 100)
      }

      // console.log({selectedRange})
      // currentEditor.selection.setRng(selectedRange)
      // currentEditor.focus()
      // re-enable page height checking (y-overflow)
      this.enableFixPagesOverflow(true)
    }
  }

  /**
   * Append a new raw page and return a promise that listen to `HeadersFooters:NewPageAppended` then resolves the appended page number
   * @param {boolean} [shouldFocusToBottom=false] set it to true if you want the editor's body section should focus to the bottom once the page is appended.
   * @listens `HeadersFooters:NewPageAppended`
   * @fires `HeadersFooters:NewPageAppending`
   * @returns {Promise} Paginator#appendingNewPages[pageNumber]
   */
  async appendNewPage (shouldFocusToBottom) {
    const pageNumber = this.getNumberOfPages() + 1
    const $body = window.$('body')
    // console.log(`Appending new page (p${pageNumber})...`)

    this.appendingNewPages[pageNumber] = new Promise((resolve, reject) => {
      let handler = (evt, data) => {
        // console.log(`HeadersFooters:NewPageAppended (page ${data.pageNumber})`)
        $body.unbind('HeadersFooters:NewPageAppended', handler)

        // resolve the new created page
        let newPage = this.getPage(data.pageNumber)
        newPage.iterateOnSections(section => section.disableEditorUI())

        // fires NodeChange on activeEditor to update the view add display the new created page
        setTimeout(() => tinymce.activeEditor.nodeChanged(), 200)

        // focus if it should
        if (shouldFocusToBottom) {
          DomUtils.focusToBottom(newPage.getBody().editor)
        }
        resolve(newPage)
      }

      $body.bind('HeadersFooters:NewPageAppended', handler)
      $body.trigger('HeadersFooters:NewPageAppending', { pageNumber })

      // append a new raw empty page
      // and let the attached editor init event
      // triggers the 'HeadersFooters:NewPageAppended' plugin event
      try {
        this.rawPages.push({})
      } catch (e) {
        reject(e)
      }
    })
    return this.appendingNewPages[pageNumber]
  }

  /**
   * Tells if there is a next page after a given page
   * @param {PaginatorPage} [page=this.currentPage] The given page. If undefined, the current page is used as the given page.
   * @returns {boolean} True if there is a page following the given one, else false.
   */
  hasNextPage (page) {
    page = page || this.currentPage
    return this.pages.length > page.pageNumber
  }

  /**
   * Get the next page after the given page if given or after the current page if exists, else null
   * @param {PaginatorPage} [page=this.currentPage] The wanted next page. If undefined, the current page is used as the given page.
   * @returns {PaginatorPage|null}
   */
  getNextPage (page) {
    page = page || this.currentPage
    return this.hasNextPage()
      ? this.getPage(page.pageNumber + 1)
      : null
  }

  /**
   * Get the size of the paginator, so the number of pages
   * @returns {Number}
   */
  getNumberOfPages () {
    return this.pages.length
  }

  /**
   * Get the last page
   * @returns {PaginatorPage}
   */
  getLastPage () {
    return this.pages[this.getNumberOfPages() - 1]
  }

  /**
   * Get the current page
   * @returns {PaginatorPage}
   */
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
            let node = DomUtils.getClosestNotBookmarkParent(editor.$, editor.selection.getNode())
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

  /**
   * Removes the page given its page number.
   * @param {Number} pageNumber The page number of the page to remove
   * @returns {void}
   */
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
    if (removingPage.pageNumber !== 1) {
      let shouldRestoreSelection = false
      const removingPageNumber = removingPage.pageNumber
      const pageIndex = removingPageNumber - 1
      shouldRestoreSelection = !this.currentPage.equals(removingPage)

      $('body').trigger('HeadersFooters:PageRemoving', {pageNumber: removingPageNumber})

      return Promise.all([
        removingPage.getBody(),
        removingPage.getHeader(),
        removingPage.getFooter()
      ].map(section => {
        section.disableEditorUI()
        return new Promise(resolve => {
          section.editor.on('remove', () => {
            section.editor.destroy()
            resolve()
          })
          section.editor.remove()
        })
      }))
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
  }

  /**
   * Go to a given page
   * @param {PaginatorPage} page The page to go to.
   * @returns {void}
   */
  goToPage (page) {
    console.log(`Goto page ${page.pageNumber}`)
    this.selectCurrentPage(page, 'body')
    page.focusOnBody()
  }

  /**
   * Sync all the headers or all the footers on each pages from a given updated section.
   * @param {HeadersFootersPlugin} updatedSection The just modified section
   * @returns {void}
   */
  syncHeadFootContent (updatedSection) {
    if (this.shouldItSyncHeadFootContent() && !updatedSection.page.isSectionEmpty(updatedSection)) {
      this.enableSyncHeadFootContent(false)
      this.pages.forEach(page => {
        if (!updatedSection.page.equals(page)) {
          page.getSection(updatedSection.type).editor.setContent(updatedSection.editor.getContent())
        }
      })
      setTimeout(() => this.enableSyncHeadFootContent(true), 100)
    }
  }

  /**
   * Get the active section
   * @returns {HeadersFootersPlugin|null} The active section
   */
  getActiveSection () {
    let activeSection = null
    this.pages.forEach(page => {
      page.iterateOnSections(section => {
        if (section.editor && section.editor === tinymce.activeEditor) {
          activeSection = section
        }
      })
    })
    return activeSection
  }
}

/**
 * Remove the overflowing content of an overflowing element and returns the rest as a clone of the given element containing only the overflowing content.
 * Caution: this is not a pure function! parentElement will be altered: the content oveflowing the page will be removed.
 * @param {PaginatorPage} page the page containing the parent element, currently overflowing it
 * @param {HTMLElement} parentElement the parent element currently overflowing that should be splitted/cloned between the given page (the overflowing page) and the next page
 * @returns {HTMLElement} a clone of `parentElement` containing
 */
async function fixOverflowAndGetAsClonedNode (page, parentElement) {
  let editor = page.getBody().editor
  let $ = editor.$
  let splittedNode
  let splittedNodeClone
  let overflowingNodes = []
  let overflowingWords = []

  let $parentElement = $(parentElement)
  let $parentElementClone = $parentElement.clone().empty()

  if ($parentElement.children().length) {
    let loopCount = 0
    const maxLoopCount = 100
    while (page.isOverflowing() && loopCount < maxLoopCount) {
      let lastNode = DomUtils.cutLastNode($, parentElement)
      if (lastNode) {
        overflowingNodes.unshift(lastNode)
      }
      loopCount++
    }

    if (loopCount === maxLoopCount) {
      console.error(`cutLastNode loop reached out ${maxLoopCount} iteration !`)
    }

    if (overflowingNodes.length) {
      splittedNode = overflowingNodes.shift()
      $parentElement.append(splittedNode)
      splittedNodeClone = await fixOverflowAndGetAsClonedNode(page, splittedNode)
      overflowingNodes.unshift(splittedNodeClone)
      $parentElementClone.append(overflowingNodes)
    }
  } else {
    let loopCount = 0
    const maxLoopCount = 1000
    while (page.isOverflowing() && loopCount < maxLoopCount) {
      let lastWord = DomUtils.cutLastWord($, parentElement)
      if (lastWord) {
        overflowingWords.unshift(lastWord)
      }
      loopCount++
    }

    if (loopCount === maxLoopCount) {
      console.error(`cutLastWord loop reached out ${maxLoopCount} iteration !`)
    }

    if (overflowingWords.length) {
      $parentElementClone.text(overflowingWords.join(' '))
    }
  }

  return $parentElementClone
}
