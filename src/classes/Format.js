'use strict'

var uiUtils = require('../utils/ui')
var units = require('../utils/units')
var $ = uiUtils.jQuery

module.exports = Format

Format.prototype.applyToPlugin = applyToPlugin
Format.prototype.calculateBodyHeight = calculateBodyHeight

Format.defaults = {}
Format.defaults['A4'] = new Format('A4', {
  height: '297mm',
  width: '210mm',
  margins: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
  header: {
    height: '20mm',
    // height: 'auto',
    margins: { right: '0', bottom: '10mm', left: '0' },
    border: { color: 'black', style: 'solid', width: '0' }
  },
  footer: {
    height: '20mm',
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
      border: { color: 'red', style: 'dashed', width: '1pt' }
    },
    footer: {
      height: '10mm',
      // height: 'auto',
      margins: { right: '0', top: '1cm', left: '0' },
      border: { color: 'red', style: 'dashed', width: '1pt' }
    },
    body: {
      border: { color: 'red', style: 'dashed', width: '1pt' }
    }
  })
}

/**
 * @param {string} name
 * @param {object} config
 */
function Format (name, config) {
  this.name = name
  this.width = config.width
  this.height = config.height
  this.margins = {
    top: config.margins.top,
    right: config.margins.right,
    bottom: config.margins.bottom,
    left: config.margins.left
  }
  this.header = {
    height: config.header.height,
    margins: {
      right: config.header.margins.right,
      bottom: config.header.margins.bottom,
      left: config.header.margins.left
    },
    border: {
      color: config.header.border.color,
      style: config.header.border.style,
      width: config.header.border.width
    }
  }
  this.footer = {
    height: config.footer.height,
    margins: {
      top: config.footer.margins.top,
      right: config.footer.margins.right,
      left: config.footer.margins.left
    },
    border: {
      color: config.footer.border.color,
      style: config.footer.border.style,
      width: config.footer.border.width
    }
  }
  this.body = {
    border: {
      color: config.body.color,
      style: config.body.style,
      width: config.body.width
    }
  }
}

function applyToPlugin (plugin) {
  var that = this
  if (plugin.documentBody) {
    var win = plugin.editor.getWin()
    var body = plugin.documentBody

    applyToStackedLayout()
    applyToBody()
  }

  function applyToStackedLayout () {
    // var bodyHeight = uiUtils.getElementHeight(body)
    var bodyHeight
    if (plugin.type === 'body') {
      bodyHeight = that.calculateBodyHeight()
    } else {
      bodyHeight = that[plugin.type].height
    }
    var rules = {
      boxSizing: 'border-box',
      height: bodyHeight,
      minHeight: bodyHeight,
      maxHeight: bodyHeight
    }

    plugin.stackedLayout.editarea.css({border: 0})
    plugin.stackedLayout.iframe.css(rules)
  }

  function applyToBody () {
    // var bodyHeight = uiUtils.getElementHeight(body, win)
    if (plugin.isMaster) {
      plugin.pageLayout.pageWrapper.css({
        overflow: 'hidden', // TODO: update model spec
        background: '#464646',
        // height: 'auto', // TODO: update model spec
        position: 'fixed', // TODO: update model spec
        top: 0, // TODO: update model spec
        right: 0, // TODO: update model spec
        left: 0, // TODO: update model spec
        bottom: 0, // TODO: update model spec
        margin: 0
        // padding: '3cm 0 3cm 0',
        // width: '100%'
      })
      plugin.pageLayout.pagePanel.css({
        overflow: 'hidden', // TODO: update model spec
        background: 'white',
        border: 0,
        boxSizing: 'border-box',
        height: that.height,
        margin: '4cm auto',
        paddingTop: that.margins.top,
        paddingRight: that.margins.right,
        paddingBottom: that.margins.bottom,
        paddingLeft: that.margins.left,
        width: that.width
      })
      plugin.pageLayout.headerWrapper.css({
        overflow: 'hidden', // TODO: update model spec
        border: 0,
        borderBottom: 'dashed 1px gray', // TODO update model spec?
        boxSizing: 'border-box',
        height: that.header.height + that.header.margins.bottom,
        margin: 0,
        padding: 0
        // width: '100%' // TODO: update model spec
      })
      /* TODO: split border to top/right/bottom/left */
      plugin.pageLayout.headerPanel.css({
        overflow: 'hidden', // TODO: update model spec
        background: 'yellow',
        borderColor: that.header.border.color,
        borderStyle: that.header.border.style,
        borderWidth: that.header.border.width,
        boxSizing: 'border-box',
        height: that.header.height,
        marginTop: 0,
        marginRight: that.header.margins.right,
        marginBottom: that.header.margins.bottom,
        marginLeft: that.header.margins.left,
        padding: 0
        // width: '100%' // TODO: update model spec
      })
      plugin.pageLayout.bodyWrapper.css({
        overflow: 'hidden', // TODO: update model spec
        border: 0,
        boxSizing: 'border-box',
        height: 'auto',
        margin: 0,
        padding: 0,
        width: '100%'
      })
      plugin.pageLayout.bodyPanel.css({
        overflow: 'hidden', // TODO: update model spec
        background: '#eee',
        borderColor: that.body.border.color,
        borderStyle: that.body.border.style,
        borderWidth: that.body.border.width,
        boxSizing: 'border-box',
        height: that.calculateBodyHeight(),
        margin: 0,
        padding: 0,
        width: '100%'
      })
      plugin.pageLayout.footerWrapper.css({
        overflow: 'hidden', // TODO: update model spec
        background: 'yellow',
        border: 0,
        borderTop: 'dashed 1px gray', // TODO update model spec?
        boxSizing: 'border-box',
        height: that.footer.height + that.footer.margins.top,
        margin: 0,
        padding: 0
        // width: '100%' // TODO: update model spec
      })
      /* TODO: split border to top/right/bottom/left */
      plugin.pageLayout.footerPanel.css({
        overflow: 'hidden', // TODO: update model spec
        borderColor: that.footer.border.color,
        borderStyle: that.footer.border.style,
        borderWidth: that.footer.border.width,
        boxSizing: 'border-box',
        height: that.footer.height,
        marginTop: that.footer.margins.top,
        marginRight: that.footer.margins.right,
        marginBottom: 0,
        marginLeft: that.footer.margins.left,
        padding: 0
        // width: '100%' // TODO: update model spec
      })
    }

    // NOTE: set padding to zero to fix unknown bug
    // where all iframe's body paddings are set to '2cm'...
    // TODO: remove this statement if the 2cm padding source is found.
    $(body, win).css({
      // margin: 0,
      padding: 0,
      overflow: 'hidden'
    })
  }
}

function calculateBodyHeight () {
  // console.log('format: ', this)
  var ret
  var value = units.getValueFromStyle(this.height) -
    units.getValueFromStyle(this.margins.top) - units.getValueFromStyle(this.margins.bottom) -
    units.getValueFromStyle(this.header.height) - units.getValueFromStyle(this.header.margins.bottom) -
    units.getValueFromStyle(this.footer.height) - units.getValueFromStyle(this.footer.margins.top)
  ret = value + 'mm'
  console.log('calculateBodyHeight() => ', ret)
  return ret
}
