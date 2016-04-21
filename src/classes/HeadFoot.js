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
