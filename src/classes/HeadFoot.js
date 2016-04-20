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
  this.live();
  $(this.node).on('dbl-click',onNodeDblclick);
}

function onNodeDblclick(){
  window.alert('dbl-click');
}

HeadFoot.prototype._createNode = function(){
  this.node = $('<section>')
    .addClass('data-headfoot')
    .html('Double-click to edit this content')
  ;
};

HeadFoot.prototype.enter = function(){
  ui.unlockNode.call(this.node);
};

HeadFoot.prototype.live = function(){ console.log('live');
  ui.lockNode.call(this.node);
};

module.exports = HeadFoot;
