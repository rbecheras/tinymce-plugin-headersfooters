'use strict'

var uiUtils = require('../utils/ui')

module.exports = Format

Format.prototype.applyToPlugin = applyToPlugin

Format.defaults = {}
Format.defaults['A4'] = new Format('A4', '210mm', '297mm')

if (window.env === 'development') {
  Format.defaults['dev-small'] = new Format('dev-small', '150mm', '100mm')
}

function Format (name, width, height) {
  this.name = name
  this.width = width
  this.height = height
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

    plugin.stackedLayout.iframe.css(rules)
    // console.log(body, bodyHeight, plugin.stackedLayout.iframe, uiUtils.getElementHeight(plugin.stackedLayout.iframe[0]))
  }

}
