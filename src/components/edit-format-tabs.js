'use strict'

import * as uiHelpers from '../utils/ui-helpers'

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
  let formatSelectBox = uiHelpers.createSelectBox('Format', 'newformat', formatValues, 150)

  // orientation select box
  let orientationSelectBox = uiHelpers.createSelectBox('Orientation', 'orientation', [
    {text: 'paysage', value: 'paysage'},
    {text: 'portrait', value: 'portrait'}
  ], 150)

  // page height form inputs
  let pageHeightTextBox = uiHelpers.createTextBox('Page height', 'pageHeight', 65)
  let pageHeightUnitSelect = uiHelpers.createUnitSelectBox('pageHeightUnit', 'mm')

  // page width form inputs
  let pageWidthTextBox = uiHelpers.createTextBox('Page width', 'pageWidth', 65)
  let pageWidthUnitSelect = uiHelpers.createUnitSelectBox('pageWidthUnit', 'mm')

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
  let formatForm = uiHelpers.createForm([
    formatSelectBox,
    orientationSelectBox
  ], 1)

  // paperSize fieldset form
  let paperSizeForm = uiHelpers.createForm([
    pageHeightTextBox, pageHeightUnitSelect,
    pageWidthTextBox, pageWidthUnitSelect
  ], 2)

  // format fieldset
  let formatFieldSet = uiHelpers.createFieldset('Format', [formatForm], null, 300)

  // format fieldset
  let paperSizeFieldSet = uiHelpers.createFieldset('Paper Size', [paperSizeForm], 460)

  // tab
  let tab = uiHelpers.createTab('Paper', [formatFieldSet, paperSizeFieldSet])

  return tab
}

/**
 * Create the margins tab component that show form inputs for:
 * - paper margins
 * @returns {TabPanel} marginTab
 */
export function createMarginsTab (format) {
  let marginTopTextBox = uiHelpers.createTextBox('Margin top', 'marginTop', 65)
  let marginTopUnitSelect = uiHelpers.createUnitSelectBox('marginTopUnit', 'mm')

  let marginRightTextBox = uiHelpers.createTextBox('Margin right', 'marginRight', 65)
  let marginRightUnitSelect = uiHelpers.createUnitSelectBox('marginRightUnit', 'mm')

  let marginBottomTextBox = uiHelpers.createTextBox('Margin bottom', 'marginBottom', 65)
  let marginBottomUnitSelect = uiHelpers.createUnitSelectBox('marginBottomUnit', 'mm')

  let marginLeftTextBox = uiHelpers.createTextBox('Margin left', 'marginLeft', 65)
  let marginLeftUnitSelect = uiHelpers.createUnitSelectBox('marginLeftUnit', 'mm')

  // paperSize fieldset form
  let form = uiHelpers.createForm([
    marginTopTextBox, marginTopUnitSelect,
    marginRightTextBox, marginRightUnitSelect,
    marginBottomTextBox, marginBottomUnitSelect,
    marginLeftTextBox, marginLeftUnitSelect
  ], 2)

  let fieldSet = uiHelpers.createFieldset('Margins', [form], 460)

  // tab
  let tab = uiHelpers.createTab('Margin', [fieldSet])

  return tab
}

/**
 * Create the margins tab component that show form inputs for:
 * - paper margins
 * @returns {TabPanel} marginTab
 */
export function createHeaderTab (format) {
  // header height
  let heightTextBox = uiHelpers.createTextBox('Height', 'headerHeight', 65)
  let heightUnitSelect = uiHelpers.createUnitSelectBox('headerHeightUnit', 'mm')

  let heightForm = uiHelpers.createForm([
    heightTextBox, heightUnitSelect
  ], 2)

  let heightFieldSet = uiHelpers.createFieldset('Header dimensions', [heightForm], 460)

  // header margins

  let marginRightTextBox = uiHelpers.createTextBox('Margin right', 'headerMarginRight', 65)
  let marginRightUnitSelect = uiHelpers.createUnitSelectBox('headerMarginRightUnit', 'mm')

  let marginBottomTextBox = uiHelpers.createTextBox('Margin bottom', 'headerMarginBottom', 65)
  let marginBottomUnitSelect = uiHelpers.createUnitSelectBox('headerMarginBottomUnit', 'mm')

  let marginLeftTextBox = uiHelpers.createTextBox('Margin left', 'headerMarginLeft', 65)
  let marginLeftUnitSelect = uiHelpers.createUnitSelectBox('headerMarginLeftUnit', 'mm')

  let form = uiHelpers.createForm([
    marginRightTextBox, marginRightUnitSelect,
    marginBottomTextBox, marginBottomUnitSelect,
    marginLeftTextBox, marginLeftUnitSelect
  ], 2)

  let marginsFieldSet = uiHelpers.createFieldset('Header margins', [form], 460)

  // header borders
  let borderWidthTextBox = uiHelpers.createTextBox('Border width', 'headerBorderWidth', 65)
  let borderWidthUnitSelect = uiHelpers.createUnitSelectBox('headerBorderWidthUnit', 'mm')

  // border style
  let borderStyleItemNone = uiHelpers.createListBoxItem('none')
  let borderStyleItemHidden = uiHelpers.createListBoxItem('hidden')
  let borderStyleItemDotted = uiHelpers.createListBoxItem('dotted')
  let borderStyleItemDashed = uiHelpers.createListBoxItem('dashed')
  let borderStyleItemSolid = uiHelpers.createListBoxItem('solid')
  let borderStyleItemDouble = uiHelpers.createListBoxItem('double')
  let borderStyleItemGroove = uiHelpers.createListBoxItem('groove')
  let borderStyleItemRidge = uiHelpers.createListBoxItem('ridge')
  let borderStyleItemInset = uiHelpers.createListBoxItem('inset')
  let borderStyleItemOutset = uiHelpers.createListBoxItem('outset')
  let borderStyleValues = [
    borderStyleItemNone, borderStyleItemHidden, borderStyleItemDotted,
    borderStyleItemDashed, borderStyleItemSolid, borderStyleItemDouble,
    borderStyleItemGroove, borderStyleItemRidge, borderStyleItemInset,
    borderStyleItemOutset
  ]
  let borderStyleListBox = uiHelpers.createListBox('Border style', 'headerBorderStyle', borderStyleValues, borderStyleItemNone, 90)

  // border color picker
  /**
   * @todo complete implementation
   */
  let borderColorPicker = uiHelpers.createColorPicker('Border color', 'headerBorderColor', () => {
    // implement here
  })

  // create form
  let borderForm1 = uiHelpers.createForm([ borderWidthTextBox, borderWidthUnitSelect ])
  let borderForm2 = uiHelpers.createForm([ borderStyleListBox, borderColorPicker ], 1)
  // create field set
  let borderFieldset = uiHelpers.createFieldset('Header borders', [ borderForm1, borderForm2 ], 460)

  // tab
  let tab = uiHelpers.createTab('Header', [heightFieldSet, marginsFieldSet, borderFieldset])

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
  let heightTextBox = uiHelpers.createTextBox('Height', 'footerHeight', 65)
  let heightUnitSelect = uiHelpers.createUnitSelectBox('footerHeightUnit', 'mm')

  let heightForm = uiHelpers.createForm([
    heightTextBox, heightUnitSelect
  ], 2)

  let heightFieldSet = uiHelpers.createFieldset('Footer dimensions', [heightForm], 460)

  // header margins

  let marginTopTextBox = uiHelpers.createTextBox('Margin top', 'footerMarginTop', 65)
  let marginTopUnitSelect = uiHelpers.createUnitSelectBox('footerMarginTopUnit', 'mm')

  let marginRightTextBox = uiHelpers.createTextBox('Margin right', 'footerMarginRight', 65)
  let marginRightUnitSelect = uiHelpers.createUnitSelectBox('footerMarginRightUnit', 'mm')

  let marginLeftTextBox = uiHelpers.createTextBox('Margin left', 'footerMarginLeft', 65)
  let marginLeftUnitSelect = uiHelpers.createUnitSelectBox('footerMarginLeftUnit', 'mm')

  let form = uiHelpers.createForm([
    marginTopTextBox, marginTopUnitSelect,
    marginRightTextBox, marginRightUnitSelect,
    marginLeftTextBox, marginLeftUnitSelect
  ], 2)

  let marginsFieldSet = uiHelpers.createFieldset('Footer margins', [form], 460)

  // footer borders
  let borderWidthTextBox = uiHelpers.createTextBox('Border width', 'footerBorderWidth', 65)
  let borderWidthUnitSelect = uiHelpers.createUnitSelectBox('footerBorderWidthUnit', 'mm')

  // border style
  let borderStyleItemNone = uiHelpers.createListBoxItem('none')
  let borderStyleItemHidden = uiHelpers.createListBoxItem('hidden')
  let borderStyleItemDotted = uiHelpers.createListBoxItem('dotted')
  let borderStyleItemDashed = uiHelpers.createListBoxItem('dashed')
  let borderStyleItemSolid = uiHelpers.createListBoxItem('solid')
  let borderStyleItemDouble = uiHelpers.createListBoxItem('double')
  let borderStyleItemGroove = uiHelpers.createListBoxItem('groove')
  let borderStyleItemRidge = uiHelpers.createListBoxItem('ridge')
  let borderStyleItemInset = uiHelpers.createListBoxItem('inset')
  let borderStyleItemOutset = uiHelpers.createListBoxItem('outset')
  let borderStyleValues = [
    borderStyleItemNone, borderStyleItemHidden, borderStyleItemDotted,
    borderStyleItemDashed, borderStyleItemSolid, borderStyleItemDouble,
    borderStyleItemGroove, borderStyleItemRidge, borderStyleItemInset,
    borderStyleItemOutset
  ]
  let borderStyleListBox = uiHelpers.createListBox('Border style', 'footerBorderStyle', borderStyleValues, borderStyleItemNone, 90)

  // border color picker
  /**
   * @todo complete implementation
   */
  let borderColorPicker = uiHelpers.createColorPicker('Border color', 'footerBorderColor', () => {
    // implement here
  })

  // create form
  let borderForm1 = uiHelpers.createForm([ borderWidthTextBox, borderWidthUnitSelect ])
  let borderForm2 = uiHelpers.createForm([ borderStyleListBox, borderColorPicker ], 1)
  // create field set
  let borderFieldset = uiHelpers.createFieldset('Footer borders', [ borderForm1, borderForm2 ], 460)

  // tab
  let tab = uiHelpers.createTab('Footer', [heightFieldSet, marginsFieldSet, borderFieldset])

  return tab
}

export function createBodyTab (format) {
  // body borders
  let borderWidthTextBox = uiHelpers.createTextBox('Border width', 'bodyBorderWidth', 65)
  let borderWidthUnitSelect = uiHelpers.createUnitSelectBox('bodyBorderWidthUnit', 'mm')

  // border style
  let borderStyleItemNone = uiHelpers.createListBoxItem('none')
  let borderStyleItemHidden = uiHelpers.createListBoxItem('hidden')
  let borderStyleItemDotted = uiHelpers.createListBoxItem('dotted')
  let borderStyleItemDashed = uiHelpers.createListBoxItem('dashed')
  let borderStyleItemSolid = uiHelpers.createListBoxItem('solid')
  let borderStyleItemDouble = uiHelpers.createListBoxItem('double')
  let borderStyleItemGroove = uiHelpers.createListBoxItem('groove')
  let borderStyleItemRidge = uiHelpers.createListBoxItem('ridge')
  let borderStyleItemInset = uiHelpers.createListBoxItem('inset')
  let borderStyleItemOutset = uiHelpers.createListBoxItem('outset')
  let borderStyleValues = [
    borderStyleItemNone, borderStyleItemHidden, borderStyleItemDotted,
    borderStyleItemDashed, borderStyleItemSolid, borderStyleItemDouble,
    borderStyleItemGroove, borderStyleItemRidge, borderStyleItemInset,
    borderStyleItemOutset
  ]
  let borderStyleListBox = uiHelpers.createListBox('Border style', 'bodyBorderStyle', borderStyleValues, borderStyleItemNone, 90)

  // border color picker
  /**
   * @todo complete implementation
   */
  let borderColorPicker = uiHelpers.createColorPicker('Border color', 'bodyBorderColor', () => {
    // implement here
  })

  // create form
  let borderForm1 = uiHelpers.createForm([ borderWidthTextBox, borderWidthUnitSelect ])
  let borderForm2 = uiHelpers.createForm([ borderStyleListBox, borderColorPicker ], 1)
  // create field set
  let borderFieldset = uiHelpers.createFieldset('Body borders', [ borderForm1, borderForm2 ], 460)

  // tab
  let tab = uiHelpers.createTab('Body', [borderFieldset])

  return tab
}
