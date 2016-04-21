'use strict';

var Header = require('./Header');
var Footer = require('./Footer');

/**
 * HeaderFactory class
 * @constructor
 */
function HeaderFooterFactory(editor){
  this._editor = editor;
}

HeaderFooterFactory.prototype.insertHeader = function(){
  this.header = new Header(this._editor,this._editor.getBody());
};
HeaderFooterFactory.prototype.insertFooter = function(){
  this.footer = new Footer(this._editor,this._editor.getBody());
};

module.exports = HeaderFooterFactory;
