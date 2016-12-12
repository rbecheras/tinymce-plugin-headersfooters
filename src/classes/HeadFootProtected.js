'use strict'

var $ = window.jQuery

// Protected API
module.exports = {
  createNode: createNode
}

/**
* Create a new node for an header or a footer.
* @protected
* @method
* @memberof HeadFoot
* @returns {undefined}
*/
function createNode () {
  this.node = $('<section>').attr('data-headfoot', true)[0]
  this.initParagraph()
}
