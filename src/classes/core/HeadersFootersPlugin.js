'use strict'

import Paginator from '../paginate/Paginator'
import Format from '../format/Format'
import UnitsUtils from '../utils/UnitsUtils'
import createMenuItems from '../../components/menu-items'
import editFormatOpenMainWin from '../../components/edit-format-window'
import UIUtils from '../utils/UIUtils'
import EventsUtils from '../utils/EventsUtils'
import DomUtils from '../utils/DomUtils'
import { eventHandlers, debugEventHandlers } from '../../event-handlers'

/**
 * Tinymce global namespace reference
 * @type {object}
 */
const tinymce = window.tinymce

/**
 * Tinymce headers/footers plugin class
 * @example
 * import HeadersFootersPlugin from 'tinymce-plugin-headersfooters/build/lib/classes/core/HeadersFootersPlugin.js'
 * window.tinymce.PluginManager.add('headersfooters', HeadersFootersPlugin)
 */
export default class HeadersFootersPlugin {
  /**
   * @param {tinymce.Editor} editor - The injected tinymce editor.
   */
  constructor (editor, url) {
    /**
     * Tells if the plugin is enabled or not.
     * The value is sync with !HeadersFootersPlugin#disabled
     * @see {@link HeadersFootersPlugin#disabled}
     * @type {Boolean}
     */
    this.enabled = false

    /**
     * Tells if the plugin is disabled or not.
     * The value is sync with !HeadersFootersPlugin#enabled
     * @see {@link HeadersFootersPlugin#enabled}
     * @type {Boolean}
     */
    this.disabled = true

    /**
     * The editor which has instanciated this plugin
     * @see {@link https://www.tinymce.com/docs/api/tinymce/tinymce.editor API tinymce/Editor}
     * @type {tinymce.Editor}
     */
    this.editor = editor

    /**
     * The section type in ['header', 'body', 'footer'] defined in the plugin's settings
     * @type {String}
     */
    this.type = editor.settings.headersfooters_type
    /**
     * The CSS class set on the editor template element
     * @type {String}
     */
    this.bodyClass = editor.settings.body_class

    const hfPluginClass = tinymce.PluginManager.lookup.headersfooters
    hfPluginClass.paginator = hfPluginClass.paginator || new Paginator()

    /**
     * A reference to the paginator singleton used for all pages and all sections
     * @type {Paginator}
     */
    this.paginator = hfPluginClass.paginator
    this.paginator.setRawPages(editor.settings.headersfooters_rawPaginator)

    /**
     * The page for which 3 editors and 3 plugins has been both instancied for its 3 sections
     * @type {PaginatorPage}
     */
    this.page = this.paginator.initPage(this, editor.settings.headersfooters_pageNumber)

    if (window.env === 'development') {
      window.mceHF = hfPluginClass
    }

    /**
     * A factory to help handle header the 3 pages's sections
     * @type {HeaderFooterFactory}
     */
    this.headerFooterFactory = null

    /**
     * A reference to the UnitsUtils to export it as a plugin public member,
     * for example for other plugins
     * @type {UnitsUtils}
     */
    this.UnitsUtils = UnitsUtils

    /**
     * The document body for this section
     * @type {HTMLBodyElement}
     */
    this.documentBody = null

    /**
     * A hash that keeps the references of document bodies of the other sections
     * @type {object}
     */
    this.documentBodies = {
      app: null,
      mce: {
        header: null,
        body: null,
        footer: null
      }
    }

    /**
     * A hash of references for the templates layers wrapping the section's editor
     * @type {object<String, HTMLElement>}
     */
    this.stackedLayout = {
      root: null,
      wrapper: null,
      layout: null,
      menubar: null,
      toolbar: null,
      editarea: null,
      statusbar: null
    }

    /**
     * A hash of the available formats
     * @type {object<String, Format>}
     */
    this.availableFormats = {}

    /**
     * A list of the used formats
     * @type {Array<Format>}
     */
    this.formats = []

    /**
     * A list of the custom formats
     * @type {Array<Format>}
     */
    this.customFormats = []

    /**
     * The default format
     * @type {Format}
     */
    this.defaultFormat = null

    /**
     * The format currently applied to the document
     * @type {Format}
     */
    this.paginator.currentFormat = null

    setAvailableFormats.call(this)

    /**
     * The list of all menu items created by the plugin
     * @type {Array<MenuItem>}
     */
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

    /**
     * Tells if the editable area is currently fading down or not (opacity falling down)
     * @type {boolean}
     */
    this.isEditableAreaFadingDown = false

    /**
     * Tells if the editable area is currently fading up or not (opactity growing up)
     * @type {boolean}
     */
    this.isEditableAreaFadingUp = false

    /**
     * A button element to set the section as the default section for the whole document.
     * For example, if the section is a header,
     */
    this.$setAsDefaultSectionButton = null
  }

  /**
   * Enable the editor's UI elements (top bar, menu bar, tools bar, status bar...)
   * @returns {void}
   */
  enableEditorUI () {
    this.stackedLayout.menubar.show()
    this.stackedLayout.toolbar.show()
    this.stackedLayout.statusbar.wrapper.show()
    this.stackedLayout.statusbar.path.show()
    this.stackedLayout.statusbar.wordcount.show()
    this.stackedLayout.statusbar.resizehandle.show()

    this.stackedLayout.statusbar.wrapper.css({left: 0, right: 0, zIndex: 9999})
  }

  /**
   * Disable the editor's UI elements (top bar, menu bar, tools bar, status bar...)
   * @returns {void}
   */
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
   * @returns {void}
   */
  enableEditableArea (withFocus) {
    this.enabled = true
    this.disabled = false

    let bodyElement = this.editor.getBody()
    if (bodyElement) {
      if (!this.isEditableAreaFadingUp && DomUtils.getElementOpacity(bodyElement) !== 1) {
        this.isEditableAreaFadingUp = true
        DomUtils.jQuery(bodyElement).fadeTo(250, 1, () => {
          this.editor.$(bodyElement).css({opacity: 1})
          this.isEditableAreaFadingUp = false
        })
      }
      withFocus && this.editor.focus()
    }
  }

  /**
   * Disable an editor instance (a page section)
   * @returns {void}
   */
  disableEditableArea () {
    this.enabled = false
    this.disabled = true

    let bodyElement = this.editor.getBody()
    if (bodyElement) {
      if (!this.isEditableAreaFadingDown && DomUtils.getElementOpacity(bodyElement) !== 0.25) {
        this.isEditableAreaFadingDown = true
        DomUtils.jQuery(bodyElement).fadeTo(250, 0.25, () => {
          this.editor.$(bodyElement).css({opacity: 0.25})
          this.isEditableAreaFadingDown = false
        })
      }
    }
    this.unselectContent()
  }

  /**
   * Unselect the section's editor content
   * @returns {void}
   */
  unselectContent () {
    if (this.editor && this.editor.selection && !this.editor.selection.isCollapsed()) {
      this.editor.selection.collapse()
    }
  }

  /**
   * Set the current format for all pages
   * @param {Format} format the format instance to set as current format
   * @returns {void}
   */
  setFormat (format) {
    this.paginator.currentFormat = this.paginator.currentFormat || new Format(format.name, format)
    this.editor.fire('HeadersFooters:SetFormat')
  }

  /**
   * Reloads all custom menu items created by the plugin
   * @returns {void}
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

  /**
   * Tells if the plugin extends an editor set as a header section
   * @returns {Boolean}
   */
  isHeader () {
    return this.isOfType('header')
  }

  /**
   * Tells if the plugin extends an editor set as a body section
   * @returns {Boolean}
   */
  isBody () {
    return this.isOfType('body')
  }

  /**
   * Tells if the plugin extends an editor set as a footer section
   * @returns {Boolean}
   */
  isFooter () {
    return this.isOfType('footer')
  }

  /**
   * Tells if the plugin extends an editor set as a section of the same type as the given type
   * @returns {Boolean}
   */
  isOfType (type) {
    return this.type === type
  }

  /**
   * The editor set as a body section is called the master plugin, or master section.
   * This method get the plugin extending the editor set as the master section, so as the body section.
   * @returns {HeadersFootersPlugin}
   */
  getMaster () {
    return this.page && this.page.getBody() ? this.page.getBody() : null
  }

  /**
   * Tells if the plugin is set as the master section or not
   * @returns {Boolean}
   */
  isMaster () {
    return this.isBody()
  }

  /**
   * Tells if the plugin's editor has the focus or not.
   * @returns {Boolean} True if the editor has the focus, else false.
   */
  hasFocus () {
    return this.editor && this.editor.getDoc() && this.editor.getDoc().hasFocus()
  }
}

/**
 * Set the available page formats.
 * This method is a setter but it doesn't take any argument because it use
 * the plugin settings to get the list of formats to set available.
 * @method
 * @private
 * @returns {void}
 */
function setAvailableFormats () {
  const settings = this.editor.settings

  // set enabled default formats
  const userEnabledDefaultFormats = parseParamList(settings.headersfooters_formats)
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

/**
 * This method help to parse a list of string parameters in the plugin settings
 * @inner
 * @param {String} paramValue the parameter value
 * @example
 * let paramValues = null // @type {Array}
 * expect(plugin.settings.param1).eq(['value1 value2 value3 value4'])
 * paramValues = parseParamList(plugin.settings.param1)
 * @returns {Array}
 */
function parseParamList (paramValue) {
  if (paramValue === undefined) {
    return []
  }
  if (typeof paramValue !== 'string') {
    throw new TypeError('paramValue must be a String, ' + typeof paramValue + ' given.')
  }
  return paramValue.split(' ')
}
