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
    that._onNodeDblclick();
  });
}

/**
* On node double-click event handler
* @private
* @method
 */
HeadFoot.prototype._onNodeDblclick = function(){
  console.log(this._editor.plugins.paginate);
  this._editor.plugins.paginate.disableWatchPage();
  $(this.node).blur(function(){
    window.alert('blur!');
  });
  $(this.node).focus(function(){
    window.alert('enter!');
  });
  this.enterNode();
};

/**
 * Create a new node for an header or a footer.
 * @private
 * @method
 */
HeadFoot.prototype._createNode = function(){
  this.node = $('<section>')
    .addClass('data-headfoot')
    .html('Double-click to edit this content')
  ;
};


HeadFoot.prototype.enterNode = function(){
  ui.unlockNode.call(this.node);
};

HeadFoot.prototype.liveNode = function(){ console.log('live');
  ui.lockNode.call(this.node);
};

module.exports = HeadFoot;
