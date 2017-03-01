/* File: Rectangle.js 
 *
 * Creates and initializes the Rectangle (Dye)
 * overrides the update function of GameObject to define
 * simple Dye behavior
 */

/*jslint node: true, vars: true */
/*global gEngine: false, GameObject: false, SpriteRenderable: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Rectangle(atX, atY) {
    this.kDelta = 0.3;

    this.mDye = new Renderable();
    this.mDye.setColor([1, 1, 1, 0]);
    this.mDye.getXform().setPosition(atX, atY);
    this.mDye.getXform().setSize(9, 12);
    GameObject.call(this, this.mDye);
    
    var r = new RigidRectangle(this.getXform(), 9, 12);
    this.setRigidBody(r);
}
gEngine.Core.inheritPrototype(Rectangle, GameObject);

Rectangle.prototype.update = function () {
    GameObject.prototype.update.call(this);
    if(this.mSelected) {
        // control by WASD
        var xform = this.getXform();
        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.W)) {
            xform.incYPosBy(this.kDelta);
        }
        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.S)) {
            xform.incYPosBy(-this.kDelta);
        }
        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A)) {
            xform.incXPosBy(-this.kDelta);
        }
        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
            xform.incXPosBy(this.kDelta);
        }
        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Z)) {
            xform.incRotationByDegree(1);
        }
        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.X)) {
            xform.incRotationByDegree(-1);
        }
    }
};