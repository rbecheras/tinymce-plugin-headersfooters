'use strict'

var uiHelpers = require('../utils/ui-helpers')
// var eventHandlers = require('../event-handlers')

var tinymce = window.tinymce

module.exports = {
  createFormatTab: createFormatTab,
  createMarginsTab: createMarginsTab,
  createHeaderTab: createHeaderTab,
  createFooterTab: createFooterTab
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

/**
 * Create the margins tab component that show form inputs for:
 * - paper margins
 * @method
 * @returns {TabPanel} marginTab
 */
function createHeaderTab (format) {
  // header height
  var heightTextBox = uiHelpers.createTextBox('Header height', 'headerHeight', 65)
  var heightUnitSelect = uiHelpers.createUnitSelectBox('headerHeightUnit', 'mm')

  var heightForm = uiHelpers.createForm([
    heightTextBox, heightUnitSelect
  ], 2)

  var heightFieldSet = uiHelpers.createFieldset('Header margins', [heightForm], 460)

  // header margins

  // var marginTopTextBox = uiHelpers.createTextBox('Margin top', 'headerMarginTop', 65)
  // var marginTopUnitSelect = uiHelpers.createUnitSelectBox('headerMarginTopUnit', 'mm')

  var marginRightTextBox = uiHelpers.createTextBox('Margin right', 'headerMarginRight', 65)
  var marginRightUnitSelect = uiHelpers.createUnitSelectBox('headerMarginRightUnit', 'mm')

  var marginBottomTextBox = uiHelpers.createTextBox('Margin bottom', 'headerMarginBottom', 65)
  var marginBottomUnitSelect = uiHelpers.createUnitSelectBox('headerMarginBottomUnit', 'mm')

  var marginLeftTextBox = uiHelpers.createTextBox('Margin left', 'headerMarginLeft', 65)
  var marginLeftUnitSelect = uiHelpers.createUnitSelectBox('headerMarginLeftUnit', 'mm')

  var form = uiHelpers.createForm([
    // marginTopTextBox, marginTopUnitSelect,
    marginRightTextBox, marginRightUnitSelect,
    marginBottomTextBox, marginBottomUnitSelect,
    marginLeftTextBox, marginLeftUnitSelect
  ], 2)

  var marginsFieldSet = uiHelpers.createFieldset('Header margins', [form], 460)

  // header borders
  var borderWidthTextBox = uiHelpers.createTextBox('Border width', 'headerBorderWidth', 65)
  var borderWidthUnitSelect = uiHelpers.createUnitSelectBox('headerBorderWidthUnit', 'mm')

  // border style
  var borderStyleItemNone = uiHelpers.createListBoxItem('none')
  var borderStyleItemHidden = uiHelpers.createListBoxItem('hidden')
  var borderStyleItemDotted = uiHelpers.createListBoxItem('dotted')
  var borderStyleItemDashed = uiHelpers.createListBoxItem('dashed')
  var borderStyleItemSolid = uiHelpers.createListBoxItem('solid')
  var borderStyleItemDouble = uiHelpers.createListBoxItem('double')
  var borderStyleItemGroove = uiHelpers.createListBoxItem('groove')
  var borderStyleItemRidge = uiHelpers.createListBoxItem('ridge')
  var borderStyleItemInset = uiHelpers.createListBoxItem('inset')
  var borderStyleItemOutset = uiHelpers.createListBoxItem('outset')
  var borderStyleValues = [
    borderStyleItemNone, borderStyleItemHidden, borderStyleItemDotted,
    borderStyleItemDashed, borderStyleItemSolid, borderStyleItemDouble,
    borderStyleItemGroove, borderStyleItemRidge, borderStyleItemInset,
    borderStyleItemOutset
  ]
  var borderStyleListBox = uiHelpers.createListBox('Border style', 'headerBorderStyle', borderStyleValues, borderStyleItemNone, 90)

  // border color picker
  var borderColorPicker = uiHelpers.createColorPicker('Border color', 'headerBorderColor', function () {})

  // create form
  var borderForm1 = uiHelpers.createForm([ borderWidthTextBox, borderWidthUnitSelect ])
  var borderForm2 = uiHelpers.createForm([ borderStyleListBox, borderColorPicker ], 1)
  // create field set
  var borderFieldset = uiHelpers.createFieldset('Borders', [ borderForm1, borderForm2 ], 460)

  // tab
  var tab = uiHelpers.createTab('Header', [heightFieldSet, marginsFieldSet, borderFieldset])

  return tab
}

/**
 * Create the footer tab component that show form inputs for:
 * - footer height
 * - footer margins
 * - footer borders
 * @method
 * @returns {TabPanel} footerTab
 */
function createFooterTab (format) {
  // header height
  var heightTextBox = uiHelpers.createTextBox('Footer height', 'footerHeight', 65)
  var heightUnitSelect = uiHelpers.createUnitSelectBox('footerHeightUnit', 'mm')

  var heightForm = uiHelpers.createForm([
    heightTextBox, heightUnitSelect
  ], 2)

  var heightFieldSet = uiHelpers.createFieldset('Footer margins', [heightForm], 460)

  // header margins

  var marginTopTextBox = uiHelpers.createTextBox('Margin top', 'footerMarginTop', 65)
  var marginTopUnitSelect = uiHelpers.createUnitSelectBox('footerMarginTopUnit', 'mm')

  var marginRightTextBox = uiHelpers.createTextBox('Margin right', 'footerMarginRight', 65)
  var marginRightUnitSelect = uiHelpers.createUnitSelectBox('footerMarginRightUnit', 'mm')

  var marginLeftTextBox = uiHelpers.createTextBox('Margin left', 'footerMarginLeft', 65)
  var marginLeftUnitSelect = uiHelpers.createUnitSelectBox('footerMarginLeftUnit', 'mm')

  var form = uiHelpers.createForm([
    marginTopTextBox, marginTopUnitSelect,
    marginRightTextBox, marginRightUnitSelect,
    marginLeftTextBox, marginLeftUnitSelect
  ], 2)

  var marginsFieldSet = uiHelpers.createFieldset('Footer margins', [form], 460)

  // footer borders
  var borderWidthTextBox = uiHelpers.createTextBox('Border width', 'footerBorderWidth', 65)
  var borderWidthUnitSelect = uiHelpers.createUnitSelectBox('footerBorderWidthUnit', 'mm')

  // border style
  var borderStyleItemNone = uiHelpers.createListBoxItem('none')
  var borderStyleItemHidden = uiHelpers.createListBoxItem('hidden')
  var borderStyleItemDotted = uiHelpers.createListBoxItem('dotted')
  var borderStyleItemDashed = uiHelpers.createListBoxItem('dashed')
  var borderStyleItemSolid = uiHelpers.createListBoxItem('solid')
  var borderStyleItemDouble = uiHelpers.createListBoxItem('double')
  var borderStyleItemGroove = uiHelpers.createListBoxItem('groove')
  var borderStyleItemRidge = uiHelpers.createListBoxItem('ridge')
  var borderStyleItemInset = uiHelpers.createListBoxItem('inset')
  var borderStyleItemOutset = uiHelpers.createListBoxItem('outset')
  var borderStyleValues = [
    borderStyleItemNone, borderStyleItemHidden, borderStyleItemDotted,
    borderStyleItemDashed, borderStyleItemSolid, borderStyleItemDouble,
    borderStyleItemGroove, borderStyleItemRidge, borderStyleItemInset,
    borderStyleItemOutset
  ]
  var borderStyleListBox = uiHelpers.createListBox('Border style', 'footerBorderStyle', borderStyleValues, borderStyleItemNone, 90)

  // border color picker
  var borderColorPicker = uiHelpers.createColorPicker('Border color', 'footerBorderColor', function () {})

  // create form
  var borderForm1 = uiHelpers.createForm([ borderWidthTextBox, borderWidthUnitSelect ])
  var borderForm2 = uiHelpers.createForm([ borderStyleListBox, borderColorPicker ], 1)
  // create field set
  var borderFieldset = uiHelpers.createFieldset('Borders', [ borderForm1, borderForm2 ], 460)

  // tab
  var tab = uiHelpers.createTab('Footer', [heightFieldSet, marginsFieldSet, borderFieldset])

  return tab
}
