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
        pageWidth: format.width.slice(0, -2),
        marginTop: format.margins.top.slice(0, -2),
        marginRight: format.margins.right.slice(0, -2),
        marginBottom: format.margins.bottom.slice(0, -2),
        marginLeft: format.margins.left.slice(0, -2)
      },
      onsubmit: onMainWindowSubmit
    })

    /**
     * Open edit format window submit callback
     *
     * @TODO implement heightUnit
     * @TODO implement widthUnit (etc...)
     */
    function onMainWindowSubmit (evt) {
      var d = evt.data
      var formatToApply = {
        name: 'custom',
        orientation: (d.orientation) ? d.orientation : 'portrait',
        height: (d.pageHeight) ? d.pageHeight + 'mm' : format.height,
        width: (d.pageWidth) ? d.pageWidth + 'mm' : format.width,
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
