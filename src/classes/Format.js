'use strict'

var uiUtils = require('../utils/ui')

module.exports = Format

Format.prototype.applyToPlugin = applyToPlugin

Format.defaults = {}
Format.defaults['A4'] = new Format('A4', {
  height: '297mm',
  width: '210mm',
  margins: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
  header: {
    height: 'auto',
    margins: { right: '0', bottom: '10mm', left: '0' },
    border: { color: 'black', style: 'solid', width: '0' }
  },
  footer: {
    height: 'auto',
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
      height: 'auto',
      margins: { right: '15mm', bottom: '10mm', left: '5mm' },
      border: { color: 'red', style: 'dashed', width: '1pt' }
    },
    footer: {
      height: 'auto',
      margins: { right: '0', top: '1cm', left: '0' },
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
      top: config.header.margins.top,
      right: config.header.margins.right,
      left: config.header.margins.left
    },
    border: {
      color: config.header.border.color,
      style: config.header.border.style,
      width: config.header.border.width
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
  if (plugin.documentBody) {
    var body = plugin.documentBody

    applyToStackedLayout()
  }

  function applyToStackedLayout () {
    var bodyHeight = uiUtils.getElementHeight(body)
    var rules = {
      height: bodyHeight,
      minHeight: bodyHeight,
      maxHeight: bodyHeight
    }

    plugin.stackedLayout.editarea.css({border: 0})
    plugin.stackedLayout.iframe.css(rules)
    // console.log(body, bodyHeight, plugin.stackedLayout.iframe, uiUtils.getElementHeight(plugin.stackedLayout.iframe[0]))
  }

}
