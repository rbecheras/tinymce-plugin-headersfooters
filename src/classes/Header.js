'use strict';

var HeadFoot = require('./HeadFoot');

/**
 * Header class
 * @constructor
 */
function Header(_documentBody){

  HeadFoot.call(this,_documentBody);
  this._createNode();
}

Header.prototype = Object.create(HeadFoot.prototype);

Header.prototype._createNode = function(){
  this.node = $('<section>')
    .addClass('data-headfoot')
    // .addClass('mceNonEditable')
    .attr('contenteditable',false)
    .html('Double-click to edit header Content')
    .prependTo(this._documentBody)
  ;
};

module.exports = Header;
