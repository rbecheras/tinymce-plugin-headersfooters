'use strict'

import {getElementHeight} from '../../utils/ui'
import {focusToBottom} from '../../utils/dom'
import {getValueFromStyle} from '../../utils/units'

export default class PaginatorPage {
  constructor (paginator, pageNumber) {
    this.paginator = paginator
    this.pageNumber = pageNumber
    this.currentSection = null
    this.sections = {
      header: null,
      body: null,
      footer: null
    }
  }

  /**
   * Init a page section
   * @param {*} plugin the plugin instance specific to the page section
   * @example page.sections.header = somePlugin
   */
  initSection (plugin) {
    this.sections[plugin.type] = plugin
  }

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

  getFormat () {
    return this.paginator.currentFormat
  }

  getSection (type) {
    return this.sections[type]
  }

  getHeader () {
    return this.getSection('header')
  }

  getBody () {
    return this.getSection('body')
  }

  getFooter () {
    return this.getSection('footer')
  }

  setCurrentSection (section) {
    this.currentSection = section
  }

  getCurrentSection () {
    return this.currentSection
  }

  getSectionHeight (section) {
    return section && section.editor
      ? getElementHeight(section.editor.getBody(), section.editor.getWin(), false)
      : null
  }

  getSectionContentHeight (section) {
    return section && section.editor && section.editor.getBody()
      ? section.editor.getBody().scrollHeight
      : null
  }

  isEmpty () {
    const section = this.currentSection
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

  isBefore (pageToCompare) {
    return this.pageNumber < pageToCompare.pageNumber
  }

  isAfter (pageToCompare) {
    return this.pageNumber > pageToCompare.pageNumber
  }

  isOverflowing () {
    let overflowing
    const bodySection = this.getBody()
    if (bodySection) {
      const contentHeight = this.getSectionContentHeight(bodySection)
      const maxBodyHeight = getValueFromStyle(this.getFormat().calculateBodyHeight())
      overflowing = contentHeight > maxBodyHeight
      if (overflowing) console.debug(`Page N°${this.pageNumber} Overflows !`)
    }
    return overflowing
  }

  focusOnHeader () {
    this.focusOnSection(this.getHeader())
  }

  focusOnBody () {
    this.focusOnSection(this.getBody())
  }

  focusOnFooter () {
    this.focusOnSection(this.getFooter())
  }

  focusOnSection (section) {
    section.editor.focus()
    focusToBottom(section.editor)
  }

  isAvailable () {
    return this.getBody() && this.getBody().editor && this.getBody().editor.initialized
  }

  /**
   * Iterate on all exinsting page sections in [header, body, footer]
   * @param {function} func the function to iterate on each section
   * @param thisArg if the func function should be binded to a this argument
   * @returns {undefined}
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
