'use strict'

module.exports = Format

function Format (label, width, height) {

}

Format.defaults = []
Format.defaults.push(new Format('A4', '210mm', '297mm'))

if (window.env === 'development') {
  Format.defaults.push(new Format('dev-small', '150mm', '100mm'))
}
