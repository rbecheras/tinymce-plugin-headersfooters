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

const tinymce = window.tinymce

/**
 * Create a simple text box
 * @method
 * @param {string} label The textBox label
 * @param {string} name The textBox name
 * @param {number} [maxWidth=null] The maximum width for the input
 * @param {number} [minWidth=55] The minimum width for the input
 * @returns {TextBox} textBox The new textBox
 */
export function createTextBox (label, name, maxWidth, minWidth) {
  const textBox = {
    label: label,
    name: name,
    maxWidth: maxWidth || null,
    minWidth: minWidth || null,
    onchange: (e) => {
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
export function createUnitSelectBox (inputName, defaultUnit, maxWidth, minWidth) {
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

export function createSelectBox (label, inputName, values, maxWidth, minWidth) {
  return new tinymce.ui.ListBox({
    label: label,
    name: inputName,
    type: 'listbox',
    minWidth: minWidth || 55,
    maxWidth: maxWidth || null,
    text: label,
    values: values,
    onselect: (e) => {
      // console.log('SelectBox Selected', e)
    }
  })
}

/**
 * Create a tab
 * @param {String} title the tab title
 * @param {Array<tinymce.ui.Fieldset>} fieldsets the fieldsets to inject in the tab
 * @param {String} direction the orientation in ['portrait', 'landscape'] (default: 'landscape')
 * @param {Number} columns the number of columns to set in the tab
 * @returns {tinymce.ui.Tab} the new tab
 */
export function createTab (title, fieldsets, direction, columns) {
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
 * @param {string} title The field set title
 * @param {array<object>} items The field items to put in the field set
 * @param {number} [maxWidth=null] The maximum with for the fieldset, in pixels
 * @param {number} [minWidth=null] The minimum with for the fieldset, in pixels
 * @returns {tinymce.ui.Fieldset} fieldset The new field set
 */
export function createFieldset (title, items, maxWidth, minWidth) {
  const fieldset = {
    type: 'fieldset',
    title: title,
    items: items,
    maxWidth: maxWidth || null,
    minWidth: minWidth || null
  }
  return fieldset
}

/**
 * Create a form
 * @param {array<object>} items the list of items to inject in the form
 * @param {Number} columns the number of columns to set in the form
 * @returns {object}
 */
export function createForm (items, columns) {
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
 * @returns {object}
 */
export function createListBox (label, name, values, defaultItem, maxWidth) {
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
export function createListBoxItem (text, value) {
  if (value === undefined) {
    value = text
  }
  const item = {
    text: text,
    value: value
  }
  return item
}

/**
 * Create a color picker
 * @method
 * @static
 * @param {String} label The label for the color picker
 * @param {String} name The name to identify the color picker in the form set
 * @param {Function} callback the colorpicker callback (once color selected)
 * @returns {ColorPicker} The new color picker
 */
export function createColorPicker (label, name, callback) {
  return {
    type: 'colorbox',
    label: label,
    name: name,
    minWidth: 140,
    maxWidth: 140,
    onaction: callback
  }
}
