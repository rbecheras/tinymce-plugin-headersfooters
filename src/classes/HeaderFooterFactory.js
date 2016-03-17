'use strict';

var Header = require('./Header');
var Footer = require('./Footer');

/**
 * HeaderFactory class
 * @constructor
 */
function HeaderFooterFactory(_editor){
  editor = _editor;
}

var editor;

HeaderFooterFactory.prototype.insertHeader = function(){
  this.header = new Header(editor.getBody());
};
HeaderFooterFactory.prototype.insertFooter = function(){
  this.footer = new Footer(editor.getBody());
};

module.exports = HeaderFooterFactory;
