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
    var marginsTab = editFormatTabs.createMarginsTab(format)

    // console.log('format', format)

    editor.windowManager.open({
      bodyType: 'tabpanel',
      title: 'Edit Document Format',
      body: [ formatTab, marginsTab ],
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
          bottom: d.marginsBottom + 'mm',
          left: d.marginsLeft + 'mm',
          right: d.marginsRig + 'mm',
          top: d.marginsTop + 'mm'
        },
        header: {
          border: {
            color: d.headerBordersColor,
            style: d.headerBordersStyle,
            width: d.headerBordersWidth + 'mm'
          },
          height: d.headerHeight + 'mm',
          margins: {
            bottom: d.headerMarginsBottom + 'mm',
            left: d.headerMarginsLeft + 'mm',
            right: d.headerMarginsRight + 'mm'
          }
        },
        footer: {
          border: {
            color: d.footerBordersColor,
            style: d.footerBordersStyle,
            width: d.footerBordersWidth + 'mm'
          },
          height: d.footerHeight + 'mm',
          margins: {
            top: d.footerMarginsTop + 'mm',
            left: d.footerMarginsLeft + 'mm',
            right: d.footerMarginsRight + 'mm'
          }
        },
        body: {
          border: {
            color: d.bodyBordersColor,
            style: d.bodyBordersStyle,
            width: d.bodyBordersWidth + 'mm'
          }
        }
      }
      editor.plugins.headersfooters.format = new Format('custom', formatToApply)
      editor.plugins.headersfooters.format.applyToPlugin(editor.plugins.headersfooters)
    }
  }
}
