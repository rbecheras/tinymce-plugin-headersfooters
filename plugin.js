(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./src/main');

},{"./src/main":6}],2:[function(require,module,exports){
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

},{"./HeadFoot":3}],3:[function(require,module,exports){
'use strict';

var ui = require('../utils/ui');

/**
 * Abstract class to inherit Header and Footer sub classes from.
 * @constructor
 */
function HeadFoot(editor,documentBody){
  var that=this;
  this._editor = editor;
  this._documentBody = documentBody;
  this._createNode();
  this.liveNode();
  $(this.node).dblclick(function(){
    that.enterNode();
  });
}

/**
 * Create a new node for an header or a footer.
 * @private
 * @method
 */
HeadFoot.prototype._createNode = function(){
  this.node = $('<section>')
    .attr('data-headfoot',true)
    .attr('data-headfoot-pristine',true)
    .html('Double-click to edit this content')[0]
  ;
};


HeadFoot.prototype.enterNode = function(){
  var that = this;
  this._editor.plugins.paginate.disableWatchPage();
  ui.lockNode.call(this._editor.plugins.paginate.getCurrentPage().content());
  ui.unlockNode.call(this.node);

  var headfootContent = this.node.firstChild;
  if (!headfootContent) {
    throw new Error('no child is not allowed in a headfoot');
  }
  this._editor.selection.select(headfootContent);
  if ($(this.node).attr('data-headfoot-pristine')) {
    // this._editor.selection.setContent('');
    $(this.node).removeAttr('data-headfoot-pristine');
  } else {
    this._editor.selection.collapse(true);
  }

  $(this._editor.plugins.paginate.getCurrentPage().content()).click(function(){
    that.liveNode();
  });
};

HeadFoot.prototype.liveNode = function(){
  this._editor.plugins.paginate.enableWatchPage();
  ui.lockNode.call(this.node);
  ui.unlockNode.call(this._editor.plugins.paginate.getCurrentPage().content());
};

module.exports = HeadFoot;

},{"../utils/ui":7}],4:[function(require,module,exports){
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

},{"./HeadFoot":3}],5:[function(require,module,exports){
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

},{"./Footer":2,"./Header":4}],6:[function(require,module,exports){
'use strict';

/**
 * plugin.js
 *
 * Released under LGPL License.
 * Copyright (c) 2016 SIRAP Group All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * plugin.js Tinymce plugin headersfooters
 * @file plugin.js
 * @module
 * @name tinycmce-plugin-headersfooters
 * @description A plugin for tinymce WYSIWYG HTML editor that allow to insert headers and footers - requires tinymce-plugin-paginate.
 * @link https://github.com/sirap-group/tinymce-plugin-headersfooters
 * @author Rémi Becheras
 * @author Groupe SIRAP
 * @license GNU GPL-v2 http://www.tinymce.com/license
 * @version 1.0.0
 */


/**
 * Tinymce library - injected by the plugin loader.
 * @external tinymce
 * @see {@link https://www.tinymce.com/docs/api/class/tinymce/|Tinymce API Reference}
 */
/*global tinymce:true */

/**
 * The jQuery plugin namespace - plugin dependency.
 * @external "jQuery.fn"
 * @see {@link http://learn.jquery.com/plugins/|jQuery Plugins}
 */
/*global jquery:true */

var HeaderFooterFactory = require('./classes/HeaderFooterFactory');
var ui = require('./utils/ui');

/**
 * Tinymce plugin headers/footers
 * @function
 * @global
 * @param {tinymce.Editor} editor - The injected tinymce editor.
 * @returns void
 */
function tinymcePluginHeadersFooters(editor,url) {

  function onInitHandler(){
    headerFooterFactory = new HeaderFooterFactory(editor);

    ui.menuItems.insertHeader.onclick = function(){
      headerFooterFactory.insertHeader();
    };
    ui.menuItems.insertFooter.onclick = function(){
      headerFooterFactory.insertFooter();
    };
  }

  var headerFooterFactory;

  editor.on('init',onInitHandler);

  editor.addMenuItem('insertHeader', ui.menuItems.insertHeader);
  editor.addMenuItem('insertFooter', ui.menuItems.insertFooter);

}

// Add the plugin to the tinymce PluginManager
tinymce.PluginManager.add('headersfooters', tinymcePluginHeadersFooters);

},{"./classes/HeaderFooterFactory":5,"./utils/ui":7}],7:[function(require,module,exports){
/**
 * User interface module
 * @module
 * @name ui
 * @description A module to provide configured ui elements to the plugin
 */


/**
 * A hash of menu items options
 * @var
 * @name menuItems
 * @type  {object}
 *
 */
var menuItems = {};
/**
 * Insert header menu item
 * @var
 * @name insertHeader
 * @type {object}
 * @memberof menuItems
 */
menuItems.insertHeader = {
  text: 'Insérer une entête',
  icon: 'abc',
  context: 'insert',
  onclick: function(){
    window.alert('insert header');
  }
};
/**
 * Insert footer menu item
 * @var
 * @name insertFooter
 * @type {object}
 * @memberof menuItems
 */
menuItems.insertFooter = {
  text: 'Insérer un pied de page',
  icon: 'abc',
  context: 'insert',
  onclick: function(){
    window.alert('insert footer');
  }
};

exports.menuItems = menuItems;

exports.lockNode = function(){
  $(this).attr('contenteditable',false);
};
exports.unlockNode = function(){
  $(this).attr('contenteditable',true);
  $(this).focus();
};

},{}]},{},[1]);
