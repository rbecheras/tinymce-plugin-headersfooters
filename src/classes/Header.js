'use strict';

var HeadFoot = require('./HeadFoot');

/**
 * Header class
 * @constructor
 */
function Header(editor,_documentBody){
  HeadFoot.call(this,editor,_documentBody);
  $(this.node).prependTo(this._documentBody);
}

Header.prototype = Object.create(HeadFoot.prototype);

/**
 * Create a new node for the header.
 * @private
 * @method
 * @override HeadFoot.prototype._createNode()
 */
Header.prototype._createNode = function(){
  HeadFoot.prototype._createNode.call(this);
  $(this.node).attr('data-header',true);
};

module.exports = Header;
