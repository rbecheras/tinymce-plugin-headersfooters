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
    var headerTab = editFormatTabs.createHeaderTab(format)
    var footerTab = editFormatTabs.createFooterTab(format)
    var bodyTab = editFormatTabs.createBodyTab(format)

    editor.windowManager.open({
      bodyType: 'tabpanel',
      title: 'Edit Document Format',
      body: [ formatTab, marginsTab, headerTab, footerTab, bodyTab ],
      data: {
        newformat: format.name,
        orientation: 'portrait',
        pageHeight: format.height.slice(0, -2),
        pageWidth: format.width.slice(0, -2),
        marginTop: format.margins.top.slice(0, -2),
        marginRight: format.margins.right.slice(0, -2),
        marginBottom: format.margins.bottom.slice(0, -2),
        marginLeft: format.margins.left.slice(0, -2),
        headerBorderWidth: format.header.border.width.slice(0, -2),
        headerBorderColor: format.header.border.color,
        headerBorderStyle: format.header.border.style,
        headerMarginLeft: format.header.margins.left.slice(0, -2),
        headerMarginBottom: format.header.margins.bottom.slice(0, -2),
        headerMarginRight: format.header.margins.right.slice(0, -2),
        headerHeight: format.header.height.slice(0, -2),
        footerBorderWidth: format.footer.border.width.slice(0, -2),
        footerBorderColor: format.footer.border.color,
        footerBorderStyle: format.footer.border.style,
        footerMarginLeft: format.footer.margins.left.slice(0, -2),
        footerMarginTop: format.footer.margins.top.slice(0, -2),
        footerMarginRight: format.footer.margins.right.slice(0, -2),
        footerHeight: format.footer.height.slice(0, -2),
        bodyBorderWidth: format.body.border.width.slice(0, -2),
        bodyBorderColor: format.body.border.color,
        bodyBorderStyle: format.body.border.style
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
          bottom: (d.marginBottom) ? d.marginBottom + 'mm' : format.margins.bottom,
          left: (d.marginLeft) ? d.marginLeft + 'mm' : format.margins.left,
          right: (d.marginRight) ? d.marginRight + 'mm' : format.margins.right,
          top: (d.marginTop) ? d.marginTop + 'mm' : format.margins.top
        },
        header: {
          border: {
            color: d.headerBorderColor,
            style: d.headerBorderStyle,
            width: d.headerBorderWidth + 'mm'
          },
          height: d.headerHeight + 'mm',
          margins: {
            bottom: d.headerMarginBottom + 'mm',
            left: d.headerMarginLeft + 'mm',
            right: d.headerMarginRight + 'mm'
          }
        },
        footer: {
          border: {
            color: d.footerBorderColor,
            style: d.footerBorderStyle,
            width: d.footerBorderWidth + 'mm'
          },
          height: d.footerHeight + 'mm',
          margins: {
            top: d.footerMarginTop + 'mm',
            left: d.footerMarginLeft + 'mm',
            right: d.footerMarginRight + 'mm'
          }
        },
        body: {
          border: {
            color: d.bodyBorderColor,
            style: d.bodyBorderStyle,
            width: d.bodyBorderWidth + 'mm'
          }
        }
      }
      editor.plugins.headersfooters.currentFormat = new Format('custom', formatToApply)
      editor.plugins.headersfooters.currentFormat.applyToPlugin(editor.plugins.headersfooters)
    }
  }
}
