'use strict'

var uiHelpers = require('../utils/ui-helpers')
// var eventHandlers = require('../event-handlers')

var tinymce = window.tinymce

module.exports = {
  createFormatTab: createFormatTab,
  createMarginsTab: createMarginsTab
}

/**
 * Create the general tab component that show form inputs for:
 * - paper labeled formats,
 * - paper custom size
 * @method
 * @returns {TabPanel} formatTab
 */
function createFormatTab (format) {
  // format select box
  var formats = tinymce.activeEditor.plugins.headersfooters.availableFormats
  var formatValues = []
  for (var name in formats) {
    var f = formats[name]
    formatValues.push({
      text: f.name,
      value: f.name
    })
  }
  var formatSelectBox = uiHelpers.createSelectBox('Format', 'newformat', formatValues, 150)

  // orientation select box
  var orientationSelectBox = uiHelpers.createSelectBox('Orientation', 'orientation', [
    {text: 'paysage', value: 'paysage'},
    {text: 'portrait', value: 'portrait'}
  ], 150)

  // page height form inputs
  var pageHeightTextBox = uiHelpers.createTextBox('Page height', 'pageHeight', 65)
  var pageHeightUnitSelect = uiHelpers.createUnitSelectBox('pageHeightUnit', 'mm')

  // page width form inputs
  var pageWidthTextBox = uiHelpers.createTextBox('Page width', 'pageWidth', 65)
  var pageWidthUnitSelect = uiHelpers.createUnitSelectBox('pageWidthUnit', 'mm')

  formatSelectBox.on('select', function (e) {
    var selectValue = e.control.value()
    var _format = formats[selectValue]
    pageHeightTextBox.value(_format.height.slice(0, -2)) // using raw 'mm' value
    pageWidthTextBox.value(_format.width.slice(0, -2)) // using raw 'mm' value
  })
  orientationSelectBox.on('select', function (e) {
    var selectValue = formatSelectBox.value()
    var _format = formats[selectValue]
    if (orientationSelectBox.value() === 'portrait') {
      pageHeightTextBox.value(_format.height.slice(0, -2)) // using raw 'mm' value
      pageWidthTextBox.value(_format.width.slice(0, -2)) // using raw 'mm' value
    } else {
      pageHeightTextBox.value(_format.width.slice(0, -2)) // using raw 'mm' value
      pageWidthTextBox.value(_format.height.slice(0, -2)) // using raw 'mm' value
    }
  })

  // paperSize fieldset form
  var formatForm = uiHelpers.createForm([
    formatSelectBox,
    orientationSelectBox
  ], 1)

  // paperSize fieldset form
  var paperSizeForm = uiHelpers.createForm([
    pageHeightTextBox, pageHeightUnitSelect,
    pageWidthTextBox, pageWidthUnitSelect
  ], 2)

  // format fieldset
  var formatFieldSet = uiHelpers.createFieldset('Format', [formatForm], null, 300)

  // format fieldset
  var paperSizeFieldSet = uiHelpers.createFieldset('Paper Size', [paperSizeForm], 460)

  // tab
  var tab = uiHelpers.createTab('Paper Format', [formatFieldSet, paperSizeFieldSet])

  return tab
}

/**
 * Create the margins tab component that show form inputs for:
 * - paper margins
 * @method
 * @returns {TabPanel} marginTab
 */
function createMarginsTab (format) {
  var marginTopTextBox = uiHelpers.createTextBox('Margin top', 'marginTop', 65)
  var marginTopUnitSelect = uiHelpers.createUnitSelectBox('marginTopUnit', 'mm')

  var marginRightTextBox = uiHelpers.createTextBox('Margin right', 'marginRight', 65)
  var marginRightUnitSelect = uiHelpers.createUnitSelectBox('marginRightUnit', 'mm')

  var marginBottomTextBox = uiHelpers.createTextBox('Margin bottom', 'marginBottom', 65)
  var marginBottomUnitSelect = uiHelpers.createUnitSelectBox('marginBottomUnit', 'mm')

  var marginLeftTextBox = uiHelpers.createTextBox('Margin left', 'marginLeft', 65)
  var marginLeftUnitSelect = uiHelpers.createUnitSelectBox('marginLeftUnit', 'mm')

  // paperSize fieldset form
  var form = uiHelpers.createForm([
    marginTopTextBox, marginTopUnitSelect,
    marginRightTextBox, marginRightUnitSelect,
    marginBottomTextBox, marginBottomUnitSelect,
    marginLeftTextBox, marginLeftUnitSelect
  ], 2)

  var fieldSet = uiHelpers.createFieldset('Margins', [form], 460)

  // tab
  var tab = uiHelpers.createTab('Page Margins', [fieldSet])

  return tab
}
