'use strict'

import UnitsUtils from '../utils/UnitsUtils'
import DomUtils from '../utils/DomUtils'

/**
 * The global jQuery instance
 * @type {jQuery}
 */
const $ = DomUtils.jQuery

/**
 * The class Format is used to define paper size, page dimensions like margins, headers and footers, borders, etc...
 * All the required methods are implemented to calculate and apply the CSS design of the page and section on which it is binded, required by the given dimensions.
 */
export default class Format {
  /**
   * @param {string} name The name of the format used to declare it in plugin settings
   * @param {object} config The detailed paper and page dimensions to set all Format properties
   */
  constructor (name, config) {
    /**
     * The name of the format used to declare it in plugin settings
     * @type {String}
     * @example 'customInsertMenuItem'
     * @example 'custom-insert'
     * @example 'custominsert'
     */
    this.name = name

    /**
     * The pager orientation (portrait or landscape)
     * @type {String}
     * @example 'portrait'
     */
    this.orientation = (config.height > config.width) ? 'portrait' : 'paysage'

    /**
     * The paper width in a given unit
     * @type {String}
     * @example '21cm'
     */
    this.width = config.width

    /**
     * The paper height in a given unit
     * @type {String}
     * @example '29.7cm'
     */
    this.height = config.height

    /**
     * The page margins
     * @type {Object<String, String>}
     * @property {String} top The page margin top
     * @property {String} right The page margin right
     * @property {String} bottom The page margin bottom
     * @property {String} left The page margin left
     * @example
     * let marginsConfig = {
     *   top: '1cm',
     *   right: '1cm',
     *   bottom: '1cm',
     *   left: '2cm'
     * }
     */
    this.margins = {
      top: config.margins ? config.margins.top : '0',
      right: config.margins ? config.margins.right : '0',
      bottom: config.margins ? config.margins.bottom : '0',
      left: config.margins ? config.margins.left : '0'
    }

    /**
     * The page header format
     * @type {object<String, *>}
     * @property {String} height The page header height
     * @property {Object} margins The header margins
     * @property {String} margins.right The header right margins
     * @property {String} margins.bottom The header bottom margins
     * @property {String} margins.left The header left margins
     * @property {Object} border The header borders
     * @property {String} border.color The header border color
     * @property {String} border.style The header border style
     * @property {String} border.width The header border width
     * @example
     * let headerConfig = {
     *   height: '35mm',
     *   margins: { top: '1cm', right: '1cm', bottom: '1cm', left: '2cm' },
     *   borders: { color: 'blue', style: 'dashed', width: '2pt' }
     * }
     */
    this.header = {
      height: config.header ? config.header.height : '0',
      margins: {
        right: config.header && config.header.margins ? config.header.margins.right : '0',
        bottom: config.header && config.header.margins ? config.header.margins.bottom : '0',
        left: config.header && config.header.margins ? config.header.margins.left : '0'
      },
      border: {
        color: config.header && config.header.border ? config.header.border.color : 'black',
        style: config.header && config.header.border ? config.header.border.style : 'none',
        width: config.header && config.header.border ? config.header.border.width : '0'
      }
    }

    /**
     * The page footer format
     * @type {object<String, *>}
     * @property {String} height The page footer height
     * @property {Object} margins The footer margins
     * @property {String} margins.top The footer top margins
     * @property {String} margins.right The footer right margins
     * @property {String} margins.left The footer left margins
     * @property {Object} border The footer borders
     * @property {String} border.color The footer border color
     * @property {String} border.style The footer border style
     * @property {String} border.width The footer border width
     * @example
     * let footerConfig = {
     *   height: '20mm',
     *   margins: { top: '1cm', right: '1cm', bottom: '1cm', left: '2cm' },
     *   borders: { color: 'blue', style: 'dashed', width: '2pt' }
     * }
     */
    this.footer = {
      height: config.footer ? config.footer.height : '0',
      margins: {
        top: config.footer && config.footer.margins ? config.footer.margins.top : '0',
        right: config.footer && config.footer.margins ? config.footer.margins.right : '0',
        left: config.footer && config.footer.margins ? config.footer.margins.left : '0'
      },
      border: {
        color: config.footer && config.footer.border ? config.footer.border.color : 'black',
        style: config.footer && config.footer.border ? config.footer.border.style : 'none',
        width: config.footer && config.footer.border ? config.footer.border.width : '0'
      }
    }

    /**
     * The page body format
     * @type {object<String, *>}
     * @property {Object} border The body borders
     * @property {String} border.color The body border color
     * @property {String} border.style The body border style
     * @property {String} border.width The body border width
     * @example
     * let bodyConfig = {
     *   borders: {
     *     color: 'blue',
     *     style: 'dashed',
     *     width: '2pt'
     *   }
     * }
     */
    this.body = {
      border: {
        color: config.body && config.body.border ? config.body.border.color : 'black',
        style: config.body && config.body.border ? config.body.border.style : 'none',
        width: config.body && config.body.border ? config.body.border.width : '0'
      }
    }

    /**
     * Tells if the alert to notice a format error should be displayed
     * @type {Boolean}
     */
    this.showAlert = true
  }

  /**
   * Apply the current format to the DOM and fires the `AppliedToBody` event to
   * permit the main app to bind the format object definition to the document
   * object to be saved with.
   * @param {HeadersFootersPlugin} plugin The current HeaderFooters plugin instance
   * @fires `HeadersFooters:Format:AppliedToBody`
   * @returns {void}
   */
  applyToPlugin (plugin) {
    let that = this
    let paginator = plugin.paginator
    let editor, win, body

    paginator.pages.forEach((page, pageNumber) => {
      ;['header', 'body', 'footer'].forEach(sectionType => {
        let section = page.getSection(sectionType)
        if (section && section.editor.initialized && section.documentBody) {
          plugin = section
          editor = plugin.editor
          win = editor.getWin()
          body = editor.getBody()
          apply()
        }
      })
    })

    function apply () {
      applyToStackedLayout()
      applyToBody()

      editor.fire('HeadersFooters:Format:AppliedToBody', {
        documentFormat: that
      })
    }

    function applyToStackedLayout () {
      let bodyHeight
      if (plugin.isBody()) {
        bodyHeight = that.calculateBodyHeight(editor)
      } else {
        bodyHeight = that[plugin.type].height
      }
      let rules = {
        boxSizing: 'border-box',
        height: bodyHeight,
        minHeight: bodyHeight,
        maxHeight: bodyHeight
      }

      plugin.stackedLayout.editarea.css({border: 0})
      plugin.stackedLayout.iframe.css(rules)

      setBodyCss()
    }

    function applyToBody () {
      // NOTE: set padding to zero to fix unknown bug
      // where all iframe's body paddings are set to '2cm'...
      // TODO: remove this statement if the 2cm padding source is found.
      $(body, win).css({
        margin: 0,
        padding: 0,
        overflow: 'hidden'
      })

      // var bodyHeight = uiUtils.getElementHeight(body, win)
      if (plugin.isBody()) {
        plugin.page.pageLayout.pageWrapper.css({
          overflow: 'auto', // TODO: update model spec
          background: '#464646',
          // height: 'auto', // TODO: update model spec
          position: 'absolute', // TODO: update model spec
          top: 0, // TODO: update model spec
          right: 0, // TODO: update model spec
          left: 0, // TODO: update model spec
          bottom: 0, // TODO: update model spec
          margin: 0
          // padding: '3cm 0 3cm 0',
          // width: '100%'
        })

        plugin.page.pageLayout.pagePanel.css({
          overflow: 'hidden', // TODO: update model spec
          background: 'white',
          border: 0,
          boxSizing: 'border-box',
          // minHeight: that.height, // @TODO update for pagination
          height: that.height, // @TODO update for pagination
          margin: '5mm auto',
          paddingTop: that.margins.top,
          paddingRight: that.margins.right,
          paddingBottom: that.margins.bottom,
          paddingLeft: that.margins.left,
          width: that.width
        })

        let firstPage = plugin.page.pageLayout.pagePanel.get(0)
        let lastPageIndex = plugin.page.pageLayout.pagePanel.length - 1
        let lastPage = plugin.page.pageLayout.pagePanel.get(lastPageIndex)
        // first page margin top
        $(firstPage).css({ marginTop: '2.5cm' })
        // last page margin bottom
        $(lastPage).css({ marginBottom: '2cm' })

        plugin.page.pageLayout.headerWrapper.css({
          overflow: 'hidden', // TODO: update model spec
          // border: 0,
          boxSizing: 'border-box',
          height: that.header.height + that.header.margins.bottom,
          margin: 0,
          padding: 0
          // width: '100%' // TODO: update model spec
        })

        /* TODO: split border to top/right/bottom/left */
        let hasHeader = that.hasHeader()
        let headerHasBorder = that.hasHeaderBorder()
        plugin.page.pageLayout.headerPanel.css({
          overflow: 'hidden', // TODO: update model spec
          borderColor: (hasHeader && !headerHasBorder) ? 'black' : that.header.border.color,
          borderStyle: (hasHeader && !headerHasBorder) ? 'solid' : that.header.border.style,
          borderWidth: (hasHeader && !headerHasBorder) ? '0' : that.header.border.width,
          boxSizing: 'border-box',
          height: that.header.height,
          marginTop: 0,
          marginRight: that.header.margins.right,
          marginBottom: that.header.margins.bottom,
          marginLeft: that.header.margins.left,
          padding: 0
          // width: '100%' // TODO: update model spec
        })
        if (plugin.page.pageLayout.headerIframe) {
          plugin.page.pageLayout.headerIframe.css({
            height: that.header.height,
            minHeight: that.header.height,
            maxHeight: that.header.height
          })
        }

        let bodyHeight = that.calculateBodyHeight(editor)
        // let bodyWrapperHeight = Number(units.getValueFromStyle(bodyHeight)) +
        //   Number(units.getValueFromStyle(that.body.border.width)) * 2
        // bodyWrapperHeight += 'mm'
        plugin.page.pageLayout.bodyWrapper.css({
          // overflow: 'hidden', // TODO: update model spec
          overflow: 'auto', // TODO: update for pagination
          border: 0,
          boxSizing: 'border-box',
          height: bodyHeight, // bodyWrapperHeight
          margin: 0,
          padding: 0,
          width: '100%'
        })
        plugin.page.pageLayout.bodyPanel.css({
          // overflow: 'hidden', // TODO: update model spec
          borderColor: that.body.border.color,
          borderStyle: that.body.border.style,
          borderWidth: that.body.border.width,
          boxSizing: 'border-box',
          // minHeight: that.calculateBodyHeight(), // @TODO update for pagination
          height: bodyHeight, // @TODO update for pagination
          margin: 0,
          padding: 0,
          width: '100%'
        })
        plugin.page.pageLayout.footerWrapper.css({
          overflow: 'hidden', // TODO: update model spec
          border: 0,
          // borderTop: 'dashed 1px gray', // TODO update model spec?
          boxSizing: 'border-box',
          height: that.footer.height + that.footer.margins.top,
          margin: 0,
          padding: 0
          // width: '100%' // TODO: update model spec
        })

        let hasFooter = that.hasFooter()
        let footerHasBorder = that.hasFooterBorder()
        /* TODO: split border to top/right/bottom/left */
        plugin.page.pageLayout.footerPanel.css({
          overflow: 'hidden', // TODO: update model spec
          borderColor: (hasFooter && !footerHasBorder) ? 'black' : that.footer.border.color,
          borderStyle: (hasFooter && !footerHasBorder) ? 'solid' : that.footer.border.style,
          borderWidth: (hasFooter && !footerHasBorder) ? '0' : that.footer.border.width,
          boxSizing: 'border-box',
          height: that.footer.height,
          marginTop: that.footer.margins.top,
          marginRight: that.footer.margins.right,
          marginBottom: 0,
          marginLeft: that.footer.margins.left,
          padding: 0
          // width: '100%' // TODO: update model spec
        })
        if (plugin.page.pageLayout.footerIframe) {
          plugin.page.pageLayout.footerIframe.css({
            height: that.footer.height,
            minHeight: that.footer.height,
            maxHeight: that.footer.height
          })
        }
      }
    }

    /**
     * Set iframes -> <body> CSS style:
     * - overflow-y,
     * - height
     * - border
     * @param {tinymce.Plugin} plugin
     */
    function setBodyCss () {
      let $ = editor.$
      let ctx = editor.getDoc()
      let borderWidth = plugin.stackedLayout.root.css('border-width')
      if (borderWidth === '0px') {
        // use default dashed gray border of 1px
        borderWidth = '1px'
      }
      window.winroot = plugin.stackedLayout.root
      $('html, body', ctx).css({
        'overflow-y': 'hidden'
      })
      // $('body.body-panel', ctx).css({
      //   'overflow-y': 'auto'
      // })
      $('html', ctx).css({
        'height': 'calc(100% - ' + borderWidth + ' - ' + borderWidth + ')'
      })
      $('body', ctx).css({
        // 'height': 'calc(100% - ' + borderWidth + ' - ' + borderWidth + ')',
        'height': '100%',
        'border': '1px dashed gray'
      })
    }
  }

  /**
   * Caluculate the document Body height depending the Format propeties
   * @param {external:tinymce.Editor} editor the editor instance matching with the target body
   * @returns {String} the body height (in mm for now)
   * @fires HeadersFooters:Error:NegativeBodyHeight
   * @todo support other size units (cm, pt)
   */
  calculateBodyHeight (editor) {
    let ret
    let height = UnitsUtils.getValueInPxFromAnyUnit(this.height)
    let marginTop = UnitsUtils.getValueInPxFromAnyUnit(this.margins.top)
    let marginBottom = UnitsUtils.getValueInPxFromAnyUnit(this.margins.bottom)
    let headerHeight = UnitsUtils.getValueInPxFromAnyUnit(this.header.height)
    let headerMarginBottom = UnitsUtils.getValueInPxFromAnyUnit(this.header.margins.bottom)
    let footerHeight = UnitsUtils.getValueInPxFromAnyUnit(this.footer.height)
    let footerMarginTop = UnitsUtils.getValueInPxFromAnyUnit(this.footer.margins.top)

    let value = height - marginTop - marginBottom -
      headerHeight - headerMarginBottom -
      footerHeight - footerMarginTop

    ret = value + 'px'
    // console.log('calculateBodyHeight() => ', ret)
    if (value <= 0) {
      if (this.showAlert) {
        let message
        this.showAlert = false
        message = 'Inconsistant Custom Format: « Body height < 0 ». Do you want to fix it ?'

        editor.fire('HeadersFooters:Error:NegativeBodyHeight')
        editor.windowManager.confirm(message, conf => {
          if (conf) {
            editor.execCommand('editFormatCmd')
          }
          this.showAlert = true
        })
      }
    }
    return ret
  }

  /**
   * Tells if the format contains a header
   * @returns {Boolean} True if the header dimensions are not null
   */
  hasHeader () {
    return !this.header || (this.header.height && this.header.height !== '0')
  }

  /**
   * Tells if the format contains a footer
   * @returns {Boolean} True if the footer dimensions are not null
   */
  hasFooter () {
    return !this.footer || (this.footer.height && this.footer.height !== '0')
  }

  /**
   * Tells if the format contains a header's border
   * @returns {Boolean} True if the header and header's borders dimensions are not null
   */
  hasHeaderBorder () {
    return !this.hasHeader() || (this.header.border.width && this.header.border.width !== '0')
  }

  /**
   * Tells if the format contains a footer's border
   * @returns {Boolean} True if the footer and footer's borders dimensions are not null
   */
  hasFooterBorder () {
    return !this.hasFooter() || (this.footer.border.width && this.footer.border.width !== '0')
  }
}

Format.defaults = {}
Format.defaults['A4'] = new Format('A4', {
  height: '297mm',
  width: '210mm',
  margins: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
  header: {
    height: '0',
    // height: 'auto',
    margins: { right: '0', bottom: '10mm', left: '0' },
    border: { color: 'black', style: 'solid', width: '0' }
  },
  footer: {
    height: '0',
    // height: 'auto',
    margins: { right: '0', top: '10mm', left: '0' },
    border: { color: 'black', style: 'solid', width: '0' }
  },
  body: {
    border: { color: 'black', style: 'solid', width: '0' }
  }
})

if (window.env === 'development') {
  Format.defaults['dev-small'] = new Format('dev-small', {
    height: '150mm',
    width: '100mm',
    margins: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
    header: {
      height: '10mm',
      // height: 'auto',
      margins: { right: '15mm', bottom: '10mm', left: '5mm' },
      border: { color: 'red', style: 'dashed', width: '1mm' }
    },
    footer: {
      height: '10mm',
      // height: 'auto',
      margins: { right: '0', top: '1cm', left: '0' },
      border: { color: 'red', style: 'dashed', width: '1mm' }
    },
    body: {
      border: { color: 'red', style: 'dashed', width: '1mm' }
    }
  })
}
