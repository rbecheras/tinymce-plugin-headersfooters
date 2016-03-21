'use strict';

var HeadFoot = require('./HeadFoot');

/**
 * Header class
 * @constructor
 */
function Header(_documentBody){
  HeadFoot.call(this,_documentBody);
  $(this.node).prependTo(this._documentBody);
}

Header.prototype = Object.create(HeadFoot.prototype);

module.exports = Header;
