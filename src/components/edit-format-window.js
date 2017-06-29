'use strict'

// var eventHandlers = require('../event-handlers')
// var units = require('../units')
var editFormatTabs = require('./edit-format-tabs')
// var findNodes = require('../dom/find-nodes')
// var uiHelpers = require('./helpers')

// var $ = window.jQuery

module.exports = openMainWinFunction

/**
 * Make the openMainWin function as a closure
 * @method
 * @param {Editor} editor The tinymce active editor instance
 * @returns {function} openMainWin The openMainWin closure function
 */
function openMainWinFunction (editor) {
  return openMainWin

  /**
   * Open the main paragraph properties window
   * @function
   * @inner
   * @returns {undefined}
   */
  function openMainWin (format) {
    var formatTab = editFormatTabs.createFormatTab(format)

    // console.log('format', format)

    editor.windowManager.open({
      bodyType: 'tabpanel',
      title: 'Edit Document Format',
      body: [ formatTab ],
      data: {
        newformat: format.name,
        orientation: 'portrait',
        pageHeight: format.height.slice(0, -2),
        pageWidth: format.width.slice(0, -2)
      },
      onsubmit: onMainWindowSubmit
    })

    // function setEachFormPropertyWithUnit (i, item) {
    //   units.setFormPropertyWithUnit(editor.dom, paragraphes, paragraphStyleData, item[0], item[1])
    // }
    //
    // function setEachFormPropertyWithoutUnit (i, item) {
    //   units.setFormPropertyWithoutUnit(editor.dom, paragraphes, paragraphStyleData, item[0], item[1])
    // }

    function onMainWindowSubmit () {
      console.log('editor', editor)
      editor.plugins.headersfooters.format.applyToPlugin(editor.plugins.headersfooters)
    }
  }
}
