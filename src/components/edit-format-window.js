'use strict'

// var units = require('../units')
var editFormatTabs = require('./edit-format-tabs')
var Format = require('../classes/Format')

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

    function onMainWindowSubmit (evt) {
      var d = evt.data
      var formatToApply = {
        name: 'custom',
        orientation: d.orientation,
        height: d.pageHeight + 'mm', // @TODO implement heightUnit
        width: d.pageWidth + 'mm', // @TODO implement widthUnit (etc...)
        margins: {
          bottom: d.marginsBottom,
          left: d.marginsLeft,
          right: d.marginsRight,
          top: d.marginsTop
        },
        header: {
          border: {
            color: d.headerBordersColor,
            style: d.headerBordersStyle,
            width: d.headerBordersWidth
          },
          height: d.headerHeight,
          margins: {
            bottom: d.headerMarginsBottom,
            left: d.headerMarginsLeft,
            right: d.headerMarginsRight
          }
        },
        footer: {
          border: {
            color: d.footerBordersColor,
            style: d.footerBordersStyle,
            width: d.footerBordersWidth
          },
          height: d.footerHeight,
          margins: {
            top: d.footerMarginsTop,
            left: d.footerMarginsLeft,
            right: d.footerMarginsRight
          }
        },
        body: {
          border: {
            color: d.bodyBordersColor,
            style: d.bodyBordersStyle,
            width: d.bodyBordersWidth
          }
        }
      }
      editor.plugins.headersfooters.format = new Format('custom', formatToApply)
      editor.plugins.headersfooters.format.applyToPlugin(editor.plugins.headersfooters)
    }
  }
}
