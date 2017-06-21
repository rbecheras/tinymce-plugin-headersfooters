'use strict'

/**
 * This module expose the plugin event handlers
 * @module
 * @name eventHandlers
 */

// var HeaderFooterFactory = require('./classes/HeaderFooterFactory')
var uiUtils = require('./utils/ui')
// var menuItems = require('./components/menu-items')
// var $ = window.jQuery

module.exports = {
  'Init': {
    setBodies: setBodies,
    setStackedLayout: setStackedLayout
  },
  'NodeChange': {},
  'SetContent': {},
  'BeforeSetContent': {},
  'Focus': {
    enterHeadFoot: enterHeadFoot
  },
  'Blur': {
    leaveHeadFoot: leaveHeadFoot
  },
  'KeyDown Paste SetContent NodeChange': {
    checkElementHeight: checkElementHeight
  }
}

function setBodies (evt) {
  var editor = evt.target
  this.documentBodies.mce[this.type] = editor.getBody()
  if (!this.documentBodies.app) {
    this.documentBodies.app = window.document.body
  }
}

function setStackedLayout (evt) {
  uiUtils.mapMceLayoutElements(this.bodyClass, this.stackedLayout)
}

function enterHeadFoot (evt) {
  this.enable()
}

function leaveHeadFoot (evt) {
  this.disable()
}

function checkElementHeight (evt) {
  if (this.documentBody) {
    var win = this.editor.getWin()
    // var $root = this.stackedLayout.root
    // var root = $root[0]
    var body = this.documentBody
    // var originalHeight = uiUtils.getElementHeight(root, win)
    var targetHeight = uiUtils.getElementHeight(body, win)
    // console.log(root, body)
    // console.log('root height before: ' + originalHeight)
    // console.log('from ' + originalHeight + ' to ' + targetHeight)
    // this.stackedLayout.root.css({height: targetHeight + ' !important'})
    // window.jQuery([
    //   this.stackedLayout.root,
    //   this.stackedLayout.wrapper,
    //   this.stackedLayout.layout,
    //   this.stackedLayout.editarea
    // ]).css({height: targetHeight})
    this.stackedLayout.root.css({height: targetHeight, minHeight: targetHeight, maxHeight: targetHeight})
    this.stackedLayout.wrapper.css({height: targetHeight, minHeight: targetHeight, maxHeight: targetHeight})
    this.stackedLayout.layout.css({height: targetHeight, minHeight: targetHeight, maxHeight: targetHeight})
    this.stackedLayout.editarea.css({height: targetHeight, minHeight: targetHeight, maxHeight: targetHeight})

    // $root.css({height: targetHeight})
    // var checkingHeight = uiUtils.getElementHeight(root, win)
    // console.log('root height after: ' + checkingHeight)
  }
}
