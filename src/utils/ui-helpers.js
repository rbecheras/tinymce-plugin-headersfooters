/**
 * This file contains the source code for the module `lib/ui/helpers`
 * @file
 * @author "Rémi Becheras <rbecheras@sirap.fr>"
 * @copyright 2016 © Groupe SIRAP, tout droits réservés
 * @see module:lib/ui/helpers
 */

/**
 * This module exports some useful UI helplers to create UI components
 * @module lib/ui/helpers
 */

'use strict'

var tinymce = window.tinymce

module.exports = {
  createTextBox: createTextBox,
  createUnitSelectBox: createUnitSelectBox,
  createSelectBox: createSelectBox,
  createTab: createTab,
  createFieldset: createFieldset,
  createForm: createForm,
  createListBox: createListBox,
  createListBoxItem: createListBoxItem,
  createColorPicker: createColorPicker
}

/**
 * Create a simple text box
 * @method
 * @param {string} label The textBox label
 * @param {string} name The textBox name
 * @param {number} [maxWidth=null] The maximum width for the input
 * @param {number} [minWidth=55] The minimum width for the input
 * @returns {TextBox} textBox The new textBox
 */
function createTextBox (label, name, maxWidth, minWidth) {
  var textBox = {
    label: label,
    name: name,
    maxWidth: maxWidth || null,
    minWidth: minWidth || null,
    onchange: function (e) {
      // console.log('createTextBox on action', e)
    }
  }

  return new tinymce.ui.TextBox(textBox)
}

/**
 * Create a select box to select a length unit
 * @method
 * @param {string} inputName - A name to identify the input in the form
 * @param {string} [defaultUnit=pt] - A default unit in (`pt`, `mm`, or `cm`).
 * @param {number} [maxWidth=55] - The maximum width for th input.
 * @param {number} [minWidth=55] - The minimum width for th input.
 * @returns {SelectBox} unitSelectBox The new unit select box.
 */
function createUnitSelectBox (inputName, defaultUnit, maxWidth, minWidth) {
  defaultUnit = defaultUnit || 'pt'
  return {
    label: 'Unit',
    name: inputName,
    type: 'listbox',
    minWidth: minWidth || 55,
    maxWidth: maxWidth || 55,
    values: [
      {text: 'pt', value: 'pt'},
      {text: 'cm', value: 'cm'},
      {text: 'mm', value: 'mm'}
    ],
    text: defaultUnit,
    value: defaultUnit
  }
}

function createSelectBox (label, inputName, values, maxWidth, minWidth) {
  return new tinymce.ui.ListBox({
    label: label,
    name: inputName,
    type: 'listbox',
    minWidth: minWidth || 55,
    maxWidth: maxWidth || null,
    text: label,
    values: values,
    onselect: function (e) {
      // console.log('SelectBox Selected', e)
    }
  })
}

/**
 * @function
 * @param
 * @returns
 */
function createTab (title, fieldsets, direction, columns) {
  return {
    title: title,
    type: 'form',
    items: {
      type: 'form',
      layout: 'grid',
      columns: columns || 1,
      // layout: 'flex',
      direction: direction || 'collumn',
      labelGapCalc: 'children',
      padding: 0,
      items: fieldsets
    }
  }
}

/**
 * Create a field set
 * @method
 * @param {string} title The field set title
 * @param {array<object>} items The field items to put in the field set
 * @param {number} [maxWidth=null] The maximum with for the fieldset, in pixels
 * @returns {Fieldset} fieldset The new field set
 */
function createFieldset (title, items, maxWidth, minWidth) {
  var fieldset = {
    type: 'fieldset',
    title: title,
    items: items,
    maxWidth: maxWidth || null,
    minWidth: minWidth || null
  }
  return fieldset
}

/**
 * @function
 * @param
 * @returns
 */
function createForm (items, columns) {
  return {
    type: 'form',
    labelGapCalc: false,
    padding: 0,
    layout: 'grid',
    columns: columns || 2,
    defaults: {
      type: 'textbox',
      maxWidth: 100
    },
    items: items
  }
}

/**
 * @method
 * @static
 * @param {string} label The label for the list box
 * @param {string} name The name of the list box to identify it in the form
 * @param {array<ListBoxItem>} values An array of list box items
 * @param {ListBoxItem} [defaultItem=N/A] An item to select as default value
 * @param {number} [maxWidth=null] The maximum width for the input
 * @returns
 */
function createListBox (label, name, values, defaultItem, maxWidth) {
  return {
    label: label,
    name: name,
    type: 'listbox',
    text: 'None',
    minWidth: 90,
    maxWidth: maxWidth,
    values: values
  }
}

/**
 * Create an item for createListBox() values array
 * @param {string} text The text shown for the item
 * @param {string|number} value A value for the item
 * @return {ListBoxItem}
 */
function createListBoxItem (text, value) {
  if (value === undefined) {
    value = text
  }
  var item = {
    text: text,
    value: value
  }
  return item
}

/**
 * Create a color picker
 * @method
 * @param {string} label The label for the color picker
 * @param {string} name The name to identify the color picker in the form set
 * @returns {ColorPicker} colorPicker The new color picker
 */
function createColorPicker (label, name, callback) {
  return {
    type: 'colorbox',
    label: label,
    name: name,
    minWidth: 140,
    maxWidth: 140,
    onaction: callback
  }
}
