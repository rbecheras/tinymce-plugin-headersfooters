'use strict'

import DomUtils from '../utils/DomUtils'
import UnitsUtils from '../utils/UnitsUtils'

/**
 * The PaginatorPage class allow to manipulate each paginated pages.
 * A page is composed by 3 sections: header, body and footer.
 * And the CSS design og each page is set following the same Format instance.
 * Each page share the same Format instance, managed by the Paginator singleton.
 */
export default class PaginatorPage {
  /**
   * @param {Paginator} paginator The paginator singleton reference
   * @param {Number} pageNumber The page number for this page
   */
  constructor (paginator, pageNumber) {
    /**
     * The paginator singleton reference
     * @type {Paginator}
     */
    this.paginator = paginator

    /**
     * The page number
     * @type {Number}
     */
    this.pageNumber = pageNumber

    /**
     * A reference to the current section
     * @type {HeadersFootersPlugin}
     */
    this.currentSection = null

    /**
     * @type {object} A hash retaining each section
     * @property {HeadersFootersPlugin} header The header section
     * @property {HeadersFootersPlugin} body The body section
     * @property {HeadersFootersPlugin} footer The footer section
     */
    this.sections = {
      header: null,
      body: null,
      footer: null
    }

    /**
     * The page template's layout
     * @type {Object}
     */
    this.pageLayout = null
  }

  /**
   * Init a page section
   * @param {*} plugin the plugin instance specific to the page section
   * @example page.sections.header = somePlugin
   * @returns {void}
   */
  initSection (plugin) {
    this.sections[plugin.type] = plugin
  }

  /**
   * Initialize the page template's layout
   * @returns {void}
   */
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

  /**
   * Get the page's format
   * @returns {Format} The page's format
   */
  getFormat () {
    return this.paginator.currentFormat
  }

  /**
   * Get a page's section by type
   * @param {String} type The wanted section's type
   * @returns {HeadersFootersPlugin} The wanted section.
   */
  getSection (type) {
    return this.sections[type]
  }

  /**
   * Get the header section
   * @returns {HeadersFootersPlugin} The header section
   */
  getHeader () {
    return this.getSection('header')
  }

  /**
   * Get the body section
   * @returns {HeadersFootersPlugin} The body section
   */
  getBody () {
    return this.getSection('body')
  }

  /**
   * Get the footer section
   * @returns {HeadersFootersPlugin} The footer section
   */
  getFooter () {
    return this.getSection('footer')
  }

  /**
   * Set the current section
   * @param {HeadersFootersPlugin} section The section to set as the current section
   * @returns {void}
   */
  setCurrentSection (section) {
    this.currentSection = section
  }

  /**
   * Get the current section
   * @returns {HeadersFootersPlugin} The current section
   */
  getCurrentSection () {
    return this.currentSection
  }

  /**
   * Get the real height of a given section in pixels without the unit digits.
   * @param {HeadersFootersPlugin} section The section to get the real height
   * @returns {Number} The section's height
   * @example
   * page.getSectionHeight(page.getHeader()) // => '53'
   */
  getSectionHeight (section) {
    return section && section.editor
      ? DomUtils.getElementHeight(section.editor.getBody(), section.editor.getWin(), false)
      : null
  }

  /**
   * Get the height of the given section's content height in pixels without the unit digits.
   * @param {HeadersFootersPlugin} section The section to get its content's height
   * @returns {Number}
   * @example
   * page.getSectionContentHeight(page.getFooter()) // => '42'
   */
  getSectionContentHeight (section) {
    return section && section.editor && section.editor.getBody()
      ? section.editor.getBody().scrollHeight
      : null
  }

  /**
   * Tells if the page is empty or not (the body section)
   * @returns {Boolean} True if the page is empty, else false
   */
  isEmpty () {
    return this.isSectionEmpty(this.getBody())
  }

  /**
   * Tells if the section is empty or not
   * @returns {Boolean} True if the section is empty, else false
   */
  isSectionEmpty (section) {
    const editor = section.editor
    const body = editor.getBody()
    const $ = editor.$

    let $body = $(body)
    let $children = $body.children()

    if ($children.length > 1) {
    // the page is not empty if there is more than one node
      return false
    }

    let $child = $children.first()
    // the page is empty if the unique node has no text content
    return !$child.text().trim().length
  }

  /**
   * Test if a given page is the same as the instance (this). The method is simply comparing the page numbers.
   * @param pageToCompare The page to compare with this
   * @returns {boolean} true if both are the same
   * @throws {TypeError} if the given page is not an instance of `PaginatorPage`
   */
  equals (pageToCompare) {
    if (!(pageToCompare instanceof PaginatorPage)) throw new TypeError('first argument must be an instance of PaginatorPage')
    return this.pageNumber === pageToCompare.pageNumber
  }

  /**
   * Tells if the page is before an other given page
   * @param {PaginatorPage} pageToCompare The given page to compare against
   * @returns {Boolean} True if the page is before the page given in argument
   */
  isBefore (pageToCompare) {
    return this.pageNumber < pageToCompare.pageNumber
  }

  /**
   * Tells if the page is after an other given page
   * @param {PaginatorPage} pageToCompare The given page to compare against
   * @returns {Boolean} True if the page is after the page given in argument
   */
  isAfter (pageToCompare) {
    return this.pageNumber > pageToCompare.pageNumber
  }

  /**
   * Tells if the page is overflowing, i.e. if its content overflows the height specified in the current format.
   * @returns {Boolean} True if the page is overflowing
   */
  isOverflowing () {
    let overflowing
    const bodySection = this.getBody()
    if (bodySection) {
      const contentHeight = this.getSectionContentHeight(bodySection)
      const maxBodyHeight = UnitsUtils.getValueFromStyle(this.getFormat().calculateBodyHeight())
      overflowing = contentHeight > maxBodyHeight
      if (overflowing) console.debug(`Page N°${this.pageNumber} Overflows !`)
    }
    return overflowing
  }

  /**
   * Focus to the header's editor
   * @returns {void}
   */
  focusOnHeader () {
    this.focusOnSection(this.getHeader())
  }

  /**
   * Focus to the body's editor
   * @returns {void}
   */
  focusOnBody () {
    this.focusOnSection(this.getBody())
  }

  /**
   * Focus to the footer's editor
   * @returns {void}
   */
  focusOnFooter () {
    this.focusOnSection(this.getFooter())
  }

  /**
   * Focus to the given section's editor
   * @returns {void}
   */
  focusOnSection (section) {
    section.editor.focus()
    DomUtils.focusToBottom(section.editor)
  }

  /**
   * Tells if the page is available
   * @returns {Boolean} True if the page is available, else false.
   */
  isAvailable () {
    return this.getBody() && this.getBody().editor && this.getBody().editor.initialized
  }

  /**
   * Iterate on all exinsting page sections in [header, body, footer]
   * @param {function} func the function to iterate on each section
   * @param {*} thisArg if the func function should be binded to a this argument
   * @returns {void}
   */
  iterateOnSections (func, thisArg) {
    let sections = []
    let h = this.getHeader()
    if (h) sections.push(h)
    let b = this.getBody()
    if (b) sections.push(b)
    let f = this.getFooter()
    if (f) sections.push(f)
    sections.forEach(func, thisArg)
  }
}
