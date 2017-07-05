'use strict'

var HeadFoot = require('./HeadFoot')

// var $ = window.jQuery

module.exports = Body

// Prototypal Inheritance
Body.prototype = Object.create(HeadFoot.prototype)

/**
 * Body class
 * @class
 * @augments HeadFoot
 * @param {Editor} editor The current editor
 */
function Body (editor) {
  HeadFoot.call(editor)
}
