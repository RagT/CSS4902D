/* File: GameObjectSet.js 
 *
 * Support for working with a set of GameObjects
 */

/*jslint node: true, vars: true */
/*global  */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!


function GameObjectSet() {
    this.mSet = [];
}

GameObjectSet.prototype.size = function () { return this.mSet.length; };

GameObjectSet.prototype.getObjectAt = function (index) {
    return this.mSet[index];
};

GameObjectSet.prototype.addToSet = function (obj) {
    this.mSet.push(obj);
};

GameObjectSet.prototype.update = function () {
    var i;
    for (i = 0; i < this.mSet.length; i++) {
        this.mSet[i].update();
    }
    this.removeExpiredObjects();
};

GameObjectSet.prototype.draw = function (aCamera) {
    var i;
    for (i = 0; i < this.mSet.length; i++) {
        this.mSet[i].draw(aCamera);
    }
};

GameObjectSet.prototype.getObjects = function() {
    return this.mSet;
};

GameObjectSet.prototype.removeObjectAtIndex = function(index) {
    this.mSet.splice(index, 1);
};

GameObjectSet.prototype.removeExpiredObjects = function() {
  var i;
  for(i = 0; i < this.mSet.length; i++) {
      if(this.mSet[i].isExpired()) {
          //remove object from set
          this.removeObjectAtIndex(i);
          i--; //decrement i so we dont skip objects
      }
  }
};