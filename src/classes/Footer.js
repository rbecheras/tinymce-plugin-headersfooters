'use strict';

var HeadFoot = require('./HeadFoot');

/**
 * Footer class
 * @constructor
 */
function Footer(editor,_documentBody){
  HeadFoot.call(this,editor,_documentBody);
  $(this.node).appendTo(this._documentBody);
}

Footer.prototype = Object.create(HeadFoot.prototype);

module.exports = Footer;
