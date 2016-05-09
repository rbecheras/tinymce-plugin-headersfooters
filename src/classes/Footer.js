'use strict'

var HeadFoot = require('./HeadFoot')

/**
 * Footer class
 * @constructor
 */
function Footer (editor, _documentBody, existingElement) {
  HeadFoot.call(this, editor, _documentBody, existingElement)
  $(this.node).appendTo(this._documentBody)
}

Footer.prototype = Object.create(HeadFoot.prototype)

/**
 * Create a new node for the footer.
 * @private
 * @method
 * @override HeadFoot.prototype._createNode()
 */
Footer.prototype._createNode = function () {
  HeadFoot.prototype._createNode.call(this)
  $(this.node).attr('data-headfoot-footer', true)
}

module.exports = Footer
