'use strict'

import Paginator from '../paginate/Paginator'
import Format from '../format/Format'
import UnitsUtils from '../utils/UnitsUtils'
import createMenuItems from '../../components/menu-items'
import editFormatOpenMainWin from '../../components/edit-format-window'
import UIUtils from '../utils/UIUtils'
import EventsUtils from '../utils/EventsUtils'
import { eventHandlers, debugEventHandlers } from '../../event-handlers'

const tinymce = window.tinymce

/**
 * Tinymce headers/footers plugin class
 */
export default class HeadersFootersPlugin {
  /**
   * @param {tinymce.Editor} editor - The injected tinymce editor.
   */
  constructor (editor, url) {
    this.editor = editor

    this.type = editor.settings.headersfooters_type
    this.bodyClass = editor.settings.body_class

    const hfPluginClass = tinymce.PluginManager.lookup.headersfooters
    hfPluginClass.paginator = hfPluginClass.paginator || new Paginator()
    this.paginator = hfPluginClass.paginator
    this.paginator.setRawPages(editor.settings.headersfooters_rawPaginator)

    this.page = this.paginator.initPage(this, editor.settings.headersfooters_pageNumber)

    if (window.env === 'development') {
      window.mceHF = hfPluginClass
    }

    this.headerFooterFactory = null

    this.UnitsUtils = UnitsUtils

    this.documentBody = null
    this.documentBodies = {
      app: null,
      mce: {
        header: null,
        body: null,
        footer: null
      }
    }
    this.stackedLayout = {
      root: null,
      wrapper: null,
      layout: null,
      menubar: null,
      toolbar: null,
      editarea: null,
      statusbar: null
    }

    this.availableFormats = {}
    this.formats = []
    this.customFormats = []
    this.defaultFormat = null
    this.paginator.currentFormat = null

    _setAvailableFormats.call(this)

    this.menuItemsList = createMenuItems(editor)
    UIUtils.autoAddMenuItems.call(this)

    editor.addCommand('insertPageNumberCmd', () => { editor.insertContent('{{page}}') })
    editor.addCommand('insertNumberOfPagesCmd', () => { editor.insertContent('{{pages}}') })
    editor.addCommand('editFormatCmd', () => {
      const openWindow = editFormatOpenMainWin(editor)
      openWindow(this.paginator.currentFormat)
    })

    EventsUtils.autoBindImplementedEventCallbacks.call(this, editor, eventHandlers)
    if (window.debugEventHandlers) {
      EventsUtils.autoBindImplementedEventCallbacks.call(this, editor, debugEventHandlers)
    }
  }

  enableEditorUI () {
    this.stackedLayout.menubar.show()
    this.stackedLayout.toolbar.show()
    this.stackedLayout.statusbar.wrapper.show()
    this.stackedLayout.statusbar.path.show()
    this.stackedLayout.statusbar.wordcount.show()
    this.stackedLayout.statusbar.resizehandle.show()

    this.stackedLayout.statusbar.wrapper.css({left: 0, right: 0, zIndex: 9999})
  }

  disableEditorUI () {
    this.stackedLayout.menubar.hide()
    this.stackedLayout.toolbar.hide()
    this.stackedLayout.statusbar.wrapper.hide()
    this.stackedLayout.statusbar.path.hide()
    this.stackedLayout.statusbar.wordcount.hide()
    this.stackedLayout.statusbar.resizehandle.hide()
  }

  /**
   * Enable an editor instance (so a page section)
   * @param {boolean} withFocus set it to true if you want to enable the editor and focus on it.
   */
  enableEditableArea (withFocus) {
    this.enabled = true
    this.disabled = false
    this.editor.$('body').css({opacity: 1})
    withFocus && this.editor.focus()
  }

  disableEditableArea () {
    this.enabled = false
    this.disabled = true

    if (!this.editor.selection.isCollapsed()) {
      this.editor.selection.collapse()
    }
    this.editor.$('body').css({opacity: 0.25})
  }

  setFormat (format) {
    this.paginator.currentFormat = this.paginator.currentFormat || new Format(format.name, format)
    this.editor.fire('HeadersFooters:SetFormat')
  }

  /**
   * Helper function. Do the reload of headers and footers
   * @returns {undefined}
   */
  reloadMenuItems () {
    if (this.paginator.currentFormat) {
      if (this.paginator.currentFormat.header.height && this.paginator.currentFormat.header.height !== '0') {
        this.menuItemsList.insertHeader.hide()
        this.menuItemsList.removeHeader.show()
      } else {
        this.menuItemsList.insertHeader.show()
        this.menuItemsList.removeHeader.hide()
      }
      if (this.paginator.currentFormat.footer.height && this.paginator.currentFormat.footer.height !== '0') {
        this.menuItemsList.insertFooter.hide()
        this.menuItemsList.removeFooter.show()
      } else {
        this.menuItemsList.insertFooter.show()
        this.menuItemsList.removeFooter.hide()
      }
    }
  }

  isHeader () {
    return this.type === 'header'
  }

  isBody () {
    return this.type === 'body'
  }

  isFooter () {
    return this.type === 'footer'
  }

  getMaster () {
    return this.page && this.page.getBody() ? this.page.getBody() : null
  }

  isMaster () {
    return this.isBody()
  }

  parseParamList (paramValue) {
    if (paramValue === undefined) {
      return []
    }
    if (typeof paramValue !== 'string') {
      throw new TypeError('paramValue must be a String, ' + typeof paramValue + ' given.')
    }
    return paramValue.split(' ')
  }
}

/**
 * @method
 * @private
 */
function _setAvailableFormats () {
  const settings = this.editor.settings

  // set enabled default formats
  const userEnabledDefaultFormats = this.parseParamList(settings.headersfooters_formats)
  .map(formatName => Format.defaults[formatName])
  .filter(v => !!v)

  if (userEnabledDefaultFormats.length) {
    this.formats = userEnabledDefaultFormats
  } else {
    this.formats = []
    for (var name in Format.defaults) {
      this.formats.push(Format.defaults[name])
    }
  }

  // set user custom formats
  this.customFormats = (settings.headersfooters_custom_formats || [])
  .map(f => new Format(f.name, f.config))

  // set the formats available for the editor
  this.availableFormats = {}
  // use enabled default formats
  this.formats.map(f => {
    this.availableFormats[f.name] = f
  })
  // add or override custom formats
  this.customFormats.map(f => {
    this.availableFormats[f.name] = f
  })

  // select a default format for new doc
  this.defaultFormat = this.availableFormats[settings.headersfooters_default_format] || this.formats[0] || this.customFormats[0]

  // current format is set on editor init callback
}
