'use strict';

var HeadFoot = require('./HeadFoot');

/**
 * Footer class
 * @constructor
 */
function Footer(_documentBody){
  HeadFoot.call(this,_documentBody);
  $(this.node).appendTo(this._documentBody);
}

Footer.prototype = Object.create(HeadFoot.prototype);

module.exports = Footer;
