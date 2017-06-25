'use strict'

var uiUtils = require('../utils/ui')

module.exports = Format

Format.prototype.applyToPlugin = applyToPlugin

Format.defaults = {}
Format.defaults['A4'] = new Format('A4', '210mm', '297mm')

if (window.env === 'development') {
  Format.defaults['dev-small'] = new Format('dev-small', '150mm', '100mm')
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
