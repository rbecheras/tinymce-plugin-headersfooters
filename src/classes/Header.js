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

module.exports = Header;
