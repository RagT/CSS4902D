/* File: Circle.js 
 *
 * Creates and initializes a Circle object
 * overrides the update function of GameObject to define
 * simple sprite animation behavior behavior
 */

/*jslint node: true, vars: true */
/*global gEngine: false, GameObject: false, SpriteAnimateRenderable: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Circle(atX, atY) {
    this.kDelta = 0.3;
    
    this.mCircle = new Renderable();
    this.mCircle.setColor([1, 1, 1, 0]);
    this.mCircle.getXform().setPosition(atX, atY);
    this.mCircle.getXform().setSize(12, 9.6);

    GameObject.call(this, this.mCircle);
    
    var r = new RigidCircle(this.getXform(), 4);

    r.setVelocity(0,0);
  
    this.setRigidBody(r);
}
gEngine.Core.inheritPrototype(Circle, GameObject);

Circle.prototype.update = function (aCamera) {
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