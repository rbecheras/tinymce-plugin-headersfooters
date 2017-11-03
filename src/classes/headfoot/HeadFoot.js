'use strict'

import {jQuery as $} from './dom'

const tinymce = window.tinymce

/**
 * Abstract class to inherit Header and Footer sub classes from.
 * @abstract
 */
export default class HeadFoot {
  /**
   * @param {Editor} editor The current editor
   * @param {HTMLElement} nodeElement The node element that define the section
   */
  constructor (editor, nodeElement) {
    this.node = nodeElement
  }

  setPlaceholder () {
    let translatedLabel = tinymce.i18n.translate('Double-click to edit this content')
    let $p = this.initParagraph().html(translatedLabel)
    $(this.node).append($p)
    this.pristine(true)
  }

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
   * @returns {Boolean|undefined} - The pristine value if no argument is given.
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
