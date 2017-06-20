'use strict'

module.exports = Format

function Format (name, width, height) {
  this.name = name
  this.width = width
  this.height = height
}

Format.defaults = {}
Format.defaults['A4'] = new Format('A4', '210mm', '297mm')

if (window.env === 'development') {
  Format.defaults['dev-small'] = new Format('dev-small', '150mm', '100mm')
}
