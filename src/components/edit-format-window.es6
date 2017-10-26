'use strict'

import Format from '../classes/Format'
import editFormatTabs from './edit-format-tabs'
// import * as units from '../units'

/**
 * Make the openMainWin function as a closure
 * @param {Editor} editor The tinymce active editor instance
 * @returns {function} openMainWin The openMainWin closure function
 */
export default function openMainWinFactory (editor) {
  return openMainWin

  /**
   * Open the main paragraph properties window
   * @function
   * @inner
   * @returns {undefined}
   */
  function openMainWin (format) {
    const formatTab = editFormatTabs.createFormatTab(format)
    const marginsTab = editFormatTabs.createMarginsTab(format)
    const headerTab = editFormatTabs.createHeaderTab(format)
    const footerTab = editFormatTabs.createFooterTab(format)
    const bodyTab = editFormatTabs.createBodyTab(format)

    editor.windowManager.open({
      bodyType: 'tabpanel',
      title: 'Edit Document Format',
      body: [ formatTab, marginsTab, headerTab, footerTab, bodyTab ],
      data: {
        newformat: format.name,
        orientation: format.orientation,
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
    function onMainWindowSubmit () {
      // handle all forms values in `d` for `data`
      const d = this.toJSON()
      let formatToApply = {
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
            color: d.headerBorderColor || format.header.border.color,
            style: d.headerBorderStyle || format.header.border.style,
            width: (d.headerBorderWidth) ? d.headerBorderWidth + 'mm' : format.header.border.width
          },
          height: (d.headerHeight) ? d.headerHeight + 'mm' : format.header.height,
          margins: {
            bottom: (d.headerMarginBottom) ? d.headerMarginBottom + 'mm' : format.header.margins.bottom,
            left: (d.headerMarginLeft) ? d.headerMarginLeft + 'mm' : format.header.margins.left,
            right: (d.headerMarginRight) ? d.headerMarginRight + 'mm' : format.header.margins.right
          }
        },
        footer: {
          border: {
            color: d.footerBorderColor || format.footer.border.color,
            style: d.footerBorderStyle || format.footer.border.style,
            width: (d.footerBorderWidth) ? d.footerBorderWidth + 'mm' : format.footer.border.width
          },
          height: (d.footerHeight) ? d.footerHeight + 'mm' : format.footer.height,
          margins: {
            top: (d.footerMarginTop) ? d.footerMarginTop + 'mm' : format.footer.margins.top,
            left: (d.footerMarginLeft) ? d.footerMarginLeft + 'mm' : format.footer.margins.left,
            right: (d.footerMarginRight) ? d.footerMarginRight + 'mm' : format.footer.margins.right
          }
        },
        body: {
          border: {
            color: d.bodyBorderColor || format.body.border.color,
            style: d.bodyBorderStyle || format.body.border.style,
            width: (d.bodyBorderWidth) ? d.bodyBorderWidth + 'mm' : format.body.border.width
          }
        }
      }
      editor.plugins.headersfooters.paginator.currentFormat = new Format('custom', formatToApply)
      editor.plugins.headersfooters.paginator.currentFormat.applyToPlugin(editor.plugins.headersfooters)
    }
  }
}
