'use strict'

import UIHelpersUtils from '../classes/utils/UIHelpersUtils'

/**
 * Tinypce global namespace
 * @type {external:tinymce}
 */
const tinymce = window.tinymce

/**
 * Create the general tab component that show form inputs for:
 * - paper labeled formats,
 * - paper custom size
 * @returns {TabPanel} formatTab
 */
export function createFormatTab (format) {
  // format select box
  let formats = tinymce.activeEditor.plugins.headersfooters.availableFormats
  let formatValues = []
  for (let name in formats) {
    let f = formats[name]
    formatValues.push({
      text: f.name,
      value: f.name
    })
  }
  let formatSelectBox = UIHelpersUtils.createSelectBox('Format', 'newformat', formatValues, 150)

  // orientation select box
  let orientationSelectBox = UIHelpersUtils.createSelectBox('Orientation', 'orientation', [
    {text: 'paysage', value: 'paysage'},
    {text: 'portrait', value: 'portrait'}
  ], 150)

  // page height form inputs
  let pageHeightTextBox = UIHelpersUtils.createTextBox('Page height', 'pageHeight', 65)
  let pageHeightUnitSelect = UIHelpersUtils.createUnitSelectBox('pageHeightUnit', 'mm')

  // page width form inputs
  let pageWidthTextBox = UIHelpersUtils.createTextBox('Page width', 'pageWidth', 65)
  let pageWidthUnitSelect = UIHelpersUtils.createUnitSelectBox('pageWidthUnit', 'mm')

  formatSelectBox.on('select', e => {
    let selectValue = e.control.value()
    let _format = formats[selectValue]
    pageHeightTextBox.value(_format.height.slice(0, -2)) // using raw 'mm' value
    pageWidthTextBox.value(_format.width.slice(0, -2)) // using raw 'mm' value
  })
  orientationSelectBox.on('select', e => {
    let orientation = orientationSelectBox.value()
    let height = pageHeightTextBox.value()
    let width = pageWidthTextBox.value()
    let max, min
    if (height >= width) {
      max = height
      min = width
    } else {
      max = width
      min = height
    }
    if (orientation === 'portrait') {
      pageHeightTextBox.value(max) // using raw 'mm' value
      pageWidthTextBox.value(min) // using raw 'mm' value
    } else {
      pageHeightTextBox.value(min) // using raw 'mm' value
      pageWidthTextBox.value(max) // using raw 'mm' value
    }
  })

  // paperSize fieldset form
  let formatForm = UIHelpersUtils.createForm([
    formatSelectBox,
    orientationSelectBox
  ], 1)

  // paperSize fieldset form
  let paperSizeForm = UIHelpersUtils.createForm([
    pageHeightTextBox, pageHeightUnitSelect,
    pageWidthTextBox, pageWidthUnitSelect
  ], 2)

  // format fieldset
  let formatFieldSet = UIHelpersUtils.createFieldset('Format', [formatForm], null, 300)

  // format fieldset
  let paperSizeFieldSet = UIHelpersUtils.createFieldset('Paper Size', [paperSizeForm], 460)

  // tab
  let tab = UIHelpersUtils.createTab('Paper', [formatFieldSet, paperSizeFieldSet])

  return tab
}

/**
 * Create the margins tab component that show form inputs for:
 * - paper margins
 * @returns {TabPanel} marginTab
 */
export function createMarginsTab (format) {
  let marginTopTextBox = UIHelpersUtils.createTextBox('Margin top', 'marginTop', 65)
  let marginTopUnitSelect = UIHelpersUtils.createUnitSelectBox('marginTopUnit', 'mm')

  let marginRightTextBox = UIHelpersUtils.createTextBox('Margin right', 'marginRight', 65)
  let marginRightUnitSelect = UIHelpersUtils.createUnitSelectBox('marginRightUnit', 'mm')

  let marginBottomTextBox = UIHelpersUtils.createTextBox('Margin bottom', 'marginBottom', 65)
  let marginBottomUnitSelect = UIHelpersUtils.createUnitSelectBox('marginBottomUnit', 'mm')

  let marginLeftTextBox = UIHelpersUtils.createTextBox('Margin left', 'marginLeft', 65)
  let marginLeftUnitSelect = UIHelpersUtils.createUnitSelectBox('marginLeftUnit', 'mm')

  // paperSize fieldset form
  let form = UIHelpersUtils.createForm([
    marginTopTextBox, marginTopUnitSelect,
    marginRightTextBox, marginRightUnitSelect,
    marginBottomTextBox, marginBottomUnitSelect,
    marginLeftTextBox, marginLeftUnitSelect
  ], 2)

  let fieldSet = UIHelpersUtils.createFieldset('Margins', [form], 460)

  // tab
  let tab = UIHelpersUtils.createTab('Margin', [fieldSet])

  return tab
}

/**
 * Create the margins tab component that show form inputs for:
 * - paper margins
 * @returns {TabPanel} marginTab
 */
export function createHeaderTab (format) {
  // header height
  let heightTextBox = UIHelpersUtils.createTextBox('Height', 'headerHeight', 65)
  let heightUnitSelect = UIHelpersUtils.createUnitSelectBox('headerHeightUnit', 'mm')

  let heightForm = UIHelpersUtils.createForm([
    heightTextBox, heightUnitSelect
  ], 2)

  let heightFieldSet = UIHelpersUtils.createFieldset('Header dimensions', [heightForm], 460)

  // header margins

  let marginRightTextBox = UIHelpersUtils.createTextBox('Margin right', 'headerMarginRight', 65)
  let marginRightUnitSelect = UIHelpersUtils.createUnitSelectBox('headerMarginRightUnit', 'mm')

  let marginBottomTextBox = UIHelpersUtils.createTextBox('Margin bottom', 'headerMarginBottom', 65)
  let marginBottomUnitSelect = UIHelpersUtils.createUnitSelectBox('headerMarginBottomUnit', 'mm')

  let marginLeftTextBox = UIHelpersUtils.createTextBox('Margin left', 'headerMarginLeft', 65)
  let marginLeftUnitSelect = UIHelpersUtils.createUnitSelectBox('headerMarginLeftUnit', 'mm')

  let form = UIHelpersUtils.createForm([
    marginRightTextBox, marginRightUnitSelect,
    marginBottomTextBox, marginBottomUnitSelect,
    marginLeftTextBox, marginLeftUnitSelect
  ], 2)

  let marginsFieldSet = UIHelpersUtils.createFieldset('Header margins', [form], 460)

  // header borders
  let borderWidthTextBox = UIHelpersUtils.createTextBox('Border width', 'headerBorderWidth', 65)
  let borderWidthUnitSelect = UIHelpersUtils.createUnitSelectBox('headerBorderWidthUnit', 'mm')

  // border style
  let borderStyleItemNone = UIHelpersUtils.createListBoxItem('none')
  let borderStyleItemHidden = UIHelpersUtils.createListBoxItem('hidden')
  let borderStyleItemDotted = UIHelpersUtils.createListBoxItem('dotted')
  let borderStyleItemDashed = UIHelpersUtils.createListBoxItem('dashed')
  let borderStyleItemSolid = UIHelpersUtils.createListBoxItem('solid')
  let borderStyleItemDouble = UIHelpersUtils.createListBoxItem('double')
  let borderStyleItemGroove = UIHelpersUtils.createListBoxItem('groove')
  let borderStyleItemRidge = UIHelpersUtils.createListBoxItem('ridge')
  let borderStyleItemInset = UIHelpersUtils.createListBoxItem('inset')
  let borderStyleItemOutset = UIHelpersUtils.createListBoxItem('outset')
  let borderStyleValues = [
    borderStyleItemNone, borderStyleItemHidden, borderStyleItemDotted,
    borderStyleItemDashed, borderStyleItemSolid, borderStyleItemDouble,
    borderStyleItemGroove, borderStyleItemRidge, borderStyleItemInset,
    borderStyleItemOutset
  ]
  let borderStyleListBox = UIHelpersUtils.createListBox('Border style', 'headerBorderStyle', borderStyleValues, borderStyleItemNone, 90)

  // border color picker
  /**
   * @todo complete implementation
   */
  let borderColorPicker = UIHelpersUtils.createColorPicker('Border color', 'headerBorderColor', () => {
    // implement here
  })

  // create form
  let borderForm1 = UIHelpersUtils.createForm([ borderWidthTextBox, borderWidthUnitSelect ])
  let borderForm2 = UIHelpersUtils.createForm([ borderStyleListBox, borderColorPicker ], 1)
  // create field set
  let borderFieldset = UIHelpersUtils.createFieldset('Header borders', [ borderForm1, borderForm2 ], 460)

  // tab
  let tab = UIHelpersUtils.createTab('Header', [heightFieldSet, marginsFieldSet, borderFieldset])

  return tab
}

/**
 * Create the footer tab component that show form inputs for:
 * - footer height
 * - footer margins
 * - footer borders
 * @returns {TabPanel} footerTab
 */
export function createFooterTab (format) {
  // header height
  let heightTextBox = UIHelpersUtils.createTextBox('Height', 'footerHeight', 65)
  let heightUnitSelect = UIHelpersUtils.createUnitSelectBox('footerHeightUnit', 'mm')

  let heightForm = UIHelpersUtils.createForm([
    heightTextBox, heightUnitSelect
  ], 2)

  let heightFieldSet = UIHelpersUtils.createFieldset('Footer dimensions', [heightForm], 460)

  // header margins

  let marginTopTextBox = UIHelpersUtils.createTextBox('Margin top', 'footerMarginTop', 65)
  let marginTopUnitSelect = UIHelpersUtils.createUnitSelectBox('footerMarginTopUnit', 'mm')

  let marginRightTextBox = UIHelpersUtils.createTextBox('Margin right', 'footerMarginRight', 65)
  let marginRightUnitSelect = UIHelpersUtils.createUnitSelectBox('footerMarginRightUnit', 'mm')

  let marginLeftTextBox = UIHelpersUtils.createTextBox('Margin left', 'footerMarginLeft', 65)
  let marginLeftUnitSelect = UIHelpersUtils.createUnitSelectBox('footerMarginLeftUnit', 'mm')

  let form = UIHelpersUtils.createForm([
    marginTopTextBox, marginTopUnitSelect,
    marginRightTextBox, marginRightUnitSelect,
    marginLeftTextBox, marginLeftUnitSelect
  ], 2)

  let marginsFieldSet = UIHelpersUtils.createFieldset('Footer margins', [form], 460)

  // footer borders
  let borderWidthTextBox = UIHelpersUtils.createTextBox('Border width', 'footerBorderWidth', 65)
  let borderWidthUnitSelect = UIHelpersUtils.createUnitSelectBox('footerBorderWidthUnit', 'mm')

  // border style
  let borderStyleItemNone = UIHelpersUtils.createListBoxItem('none')
  let borderStyleItemHidden = UIHelpersUtils.createListBoxItem('hidden')
  let borderStyleItemDotted = UIHelpersUtils.createListBoxItem('dotted')
  let borderStyleItemDashed = UIHelpersUtils.createListBoxItem('dashed')
  let borderStyleItemSolid = UIHelpersUtils.createListBoxItem('solid')
  let borderStyleItemDouble = UIHelpersUtils.createListBoxItem('double')
  let borderStyleItemGroove = UIHelpersUtils.createListBoxItem('groove')
  let borderStyleItemRidge = UIHelpersUtils.createListBoxItem('ridge')
  let borderStyleItemInset = UIHelpersUtils.createListBoxItem('inset')
  let borderStyleItemOutset = UIHelpersUtils.createListBoxItem('outset')
  let borderStyleValues = [
    borderStyleItemNone, borderStyleItemHidden, borderStyleItemDotted,
    borderStyleItemDashed, borderStyleItemSolid, borderStyleItemDouble,
    borderStyleItemGroove, borderStyleItemRidge, borderStyleItemInset,
    borderStyleItemOutset
  ]
  let borderStyleListBox = UIHelpersUtils.createListBox('Border style', 'footerBorderStyle', borderStyleValues, borderStyleItemNone, 90)

  // border color picker
  /**
   * @todo complete implementation
   */
  let borderColorPicker = UIHelpersUtils.createColorPicker('Border color', 'footerBorderColor', () => {
    // implement here
  })

  // create form
  let borderForm1 = UIHelpersUtils.createForm([ borderWidthTextBox, borderWidthUnitSelect ])
  let borderForm2 = UIHelpersUtils.createForm([ borderStyleListBox, borderColorPicker ], 1)
  // create field set
  let borderFieldset = UIHelpersUtils.createFieldset('Footer borders', [ borderForm1, borderForm2 ], 460)

  // tab
  let tab = UIHelpersUtils.createTab('Footer', [heightFieldSet, marginsFieldSet, borderFieldset])

  return tab
}

/**
 * Create the body tab
 * @param {Format} format The current format
 * @returns {void}
 */
export function createBodyTab (format) {
  // body borders
  let borderWidthTextBox = UIHelpersUtils.createTextBox('Border width', 'bodyBorderWidth', 65)
  let borderWidthUnitSelect = UIHelpersUtils.createUnitSelectBox('bodyBorderWidthUnit', 'mm')

  // border style
  let borderStyleItemNone = UIHelpersUtils.createListBoxItem('none')
  let borderStyleItemHidden = UIHelpersUtils.createListBoxItem('hidden')
  let borderStyleItemDotted = UIHelpersUtils.createListBoxItem('dotted')
  let borderStyleItemDashed = UIHelpersUtils.createListBoxItem('dashed')
  let borderStyleItemSolid = UIHelpersUtils.createListBoxItem('solid')
  let borderStyleItemDouble = UIHelpersUtils.createListBoxItem('double')
  let borderStyleItemGroove = UIHelpersUtils.createListBoxItem('groove')
  let borderStyleItemRidge = UIHelpersUtils.createListBoxItem('ridge')
  let borderStyleItemInset = UIHelpersUtils.createListBoxItem('inset')
  let borderStyleItemOutset = UIHelpersUtils.createListBoxItem('outset')
  let borderStyleValues = [
    borderStyleItemNone, borderStyleItemHidden, borderStyleItemDotted,
    borderStyleItemDashed, borderStyleItemSolid, borderStyleItemDouble,
    borderStyleItemGroove, borderStyleItemRidge, borderStyleItemInset,
    borderStyleItemOutset
  ]
  let borderStyleListBox = UIHelpersUtils.createListBox('Border style', 'bodyBorderStyle', borderStyleValues, borderStyleItemNone, 90)

  // border color picker
  /**
   * @todo complete implementation
   */
  let borderColorPicker = UIHelpersUtils.createColorPicker('Border color', 'bodyBorderColor', () => {
    // implement here
  })

  // create form
  let borderForm1 = UIHelpersUtils.createForm([ borderWidthTextBox, borderWidthUnitSelect ])
  let borderForm2 = UIHelpersUtils.createForm([ borderStyleListBox, borderColorPicker ], 1)
  // create field set
  let borderFieldset = UIHelpersUtils.createFieldset('Body borders', [ borderForm1, borderForm2 ], 460)

  // tab
  let tab = UIHelpersUtils.createTab('Body', [borderFieldset])

  return tab
}
