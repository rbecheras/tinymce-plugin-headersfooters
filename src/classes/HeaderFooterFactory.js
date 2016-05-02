'use strict';

var Header = require('./Header');
var Footer = require('./Footer');

/**
 * HeaderFactory class
 * @constructor
 */
function HeaderFooterFactory(editor){
  this._editor = editor;
  this._hasHeader = false;
  this._hasFooter = false;
}

/**
 * Insert a new header
 * @method
 * @returns void
 */
HeaderFooterFactory.prototype.insertHeader = function(){
  this.header = new Header(this._editor,this._editor.getBody());
  this._hasHeader = true;
};

/**
 * Insert a new footer
 * @method
 * @returns void
 */
HeaderFooterFactory.prototype.insertFooter = function(){
  this.footer = new Footer(this._editor,this._editor.getBody());
  this._hasFooter = true;
};

/**
 * Check if the document has a header or not
 * @method
 * @returns {Boolean} true if the document has a header, false if not
 */
HeaderFooterFactory.prototype.hasHeader = function(){
  return this._hasHeader;
};

/**
 * Check if the document has a footer or not
 * @method
 * @returns {Boolean} true if the document has a footer, false if not
 */
HeaderFooterFactory.prototype.hasFooter = function(){
  return this._hasFooter;
};


module.exports = HeaderFooterFactory;
