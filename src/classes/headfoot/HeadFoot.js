'use strict'

import DomUtils from '../utils/DomUtils'

/**
 * The global tinymce instance
 * @type {external:tinymce}
 */
const tinymce = window.tinymce

/**
 * The global jQuery instance
 * @type {external:jQuery}
 */
const $ = DomUtils.jQuery

/**
 * This abstract class allow to manipulate the sections of a page.
 * @abstract
 */
export default class HeadFoot {
  /**
   * @param {external:Editor} editor The current editor
   * @param {external:HTMLElement} nodeElement The node element that define the section
   */
  constructor (editor, nodeElement) {
    /**
     * The template's element on which the editor is attached and the Head/Body/Foot object is instancied
     * @type {external:HTMLElement}
     */
    this.node = nodeElement
  }

  /**
   * Set a place holder in the head/body/foot instance
   * @returns {void}
   */
  setPlaceholder () {
    let translatedLabel = tinymce.i18n.translate('Double-click to edit this content')
    let $p = this.initParagraph().html(translatedLabel)
    $(this.node).append($p)
    this.pristine(true)
  }

  /**
   * Initialize the first paragraph in the head/body/foot instance
   * @returns {void}
   */
  initParagraph () {
    let $span = $('<span>').css({ 'font-family': 'calibri', 'font-size': '12pt' })
    let $p = $('<p>').append($span)
    $span.html('<br data-mce-bogus="1">')
    $(this.node).removeAttr('data-headfoot-pristine').empty().append($p)
    return $p
  }

  /**
   * [Getter/Setter] Get or set the pristine state of the headfoot node
   * @param {Boolean} [b] If defined, the value to set
   * @returns {Boolean|void} - The pristine value if no argument is given.
   * @throws {Error} - if this.node is unset an error is thrown
   */
  pristine (b) {
    if (!this.node || !this.node.nodeType) {
      throw new Error('Missing node can not be pristine or not.')
    }
    let attr = 'data-headfoot-pristine'
    if (b === undefined) {
      return this.node.getAttribute(attr) === 'true'
    } else {
      this.node.setAttribute(attr, !!b)
    }
  }
}
