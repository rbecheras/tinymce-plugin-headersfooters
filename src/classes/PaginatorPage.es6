'use strict'

import ui from '../utils/ui'
import {getValueFromStyle} from '../utils/units'

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

  getSectionHeight () {
    return ui.getElementHeight(this.currentSection.editor.getBody(), this.currentSection.editor.getWin(), false)
  }

  getSectionContentHeight () {
    let body = this.currentSection.editor.getBody()
    if (body) {
      return body.scrollHeight
    }
  }

  isEmpty () {
    const section = this.currentSection
    const editor = section.editor
    // const body = editor.getBody()
    let selection = editor.selection
    if (selection.isCollapsed()) {
      let range = selection.getRng()
      console.error(`Range offset are: ${range.startOffset} and ${range.endOffset}.`)
      if (range.startOffset === 0) {
        return true
      } else {
        return false
      }
    }
  }
}
