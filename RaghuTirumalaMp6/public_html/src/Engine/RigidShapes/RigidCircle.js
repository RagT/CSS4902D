/* 
 * File:RigidCircle.js
 *      define a circle
 *     
 */
/*jslint node: true, vars: true, evil: true, bitwise: true */
"use strict";
/* global RigidShape, vec2, vFrom1To2 */

var RigidCircle = function (xf, radius) {
    RigidShape.call(this, xf);
    this.mType = "RigidCircle";
    this.mRadius = radius;
    this.mBoundRadius = radius;
};
gEngine.Core.inheritPrototype(RigidCircle, RigidShape);

RigidCircle.prototype.travel = function (dt) {
    // linear motion
    var p = this.mXform.getPosition();
    vec2.scaleAndAdd(p, p, this.mVelocity, dt);
    
    return this;
};

RigidCircle.prototype.draw = function (aCamera) {
    RigidShape.prototype.draw.call(this, aCamera);
    
    // kNumSides forms the circle.
    this.mLine.setColor([0, 0, 0, 1]);
    this.drawCircle(aCamera, this.mRadius);
    
    var p = this.mXform.getPosition();
    var u = [p[0], p[1]+this.mBoundRadius];
    // angular motion
    vec2.rotateWRT(u, u, this.mXform.getRotationInRad(), p);
    this.mLine.setColor([1, 1, 1, 1]);
    this.mLine.setFirstVertex(p[0], p[1]);
    this.mLine.setSecondVertex(u[0], u[1]);
    this.mLine.draw(aCamera);
    
    if(this.getShowBounds()) {
        this.drawCircle(aCamera, this.mBoundRadius);
    }
};

RigidCircle.prototype.update = function () {
    RigidShape.prototype.update.call(this);
};

RigidCircle.prototype.collidedCircCirc = function (c1, c2, collisionInfo) {
    var vFrom1To2 = vec2.fromValues(0,0);
    vec2.subtract(vFrom1To2, c2.getPosition(), c1.getPosition());
    var rSum = c1.mBoundRadius + c2.mBoundRadius;
    var dist = vec2.length(vFrom1To2);
    if (dist > Math.sqrt(rSum * rSum)) {
        //not overlapping
        return false;
    }
    if (dist !== 0) {
        // overlapping but not same position
        var normalFrom2To1 = vec2.fromValues(0,0);
        vec2.scale(normalFrom2To1, vFrom1To2, -1);
        vec2.normalize(normalFrom2To1, normalFrom2To1);
        var radiusC2 = vec2.fromValues(0,0);
        vec2.scale(radiusC2, normalFrom2To1, c2.mBoundRadius);
        var normal1To2 = vec2.fromValues(0,0);
        vec2.normalize(normal1To2, vFrom1To2);
        var start = vec2.fromValues(0,0);
        vec2.add(start, c2.getPosition(), radiusC2)
        collisionInfo.setInfo(rSum - dist, normal1To2, start);
    } else {
        //same position
        if (c1.mBoundRadius > c2.mBoundRadius) {
            collisionInfo.setInfo(rSum, vec2.fromValues(0,-1), c1.mCenter.add(vec2.fromValues(0, c1.mBoundRadius)));
        } else {
            collisionInfo.setInfo(rSum, vec2.fromValues(0,-1), c2.mCenter.add(vec2.fromValues(0, c2.mBoundRadius)));
        }
    }
    return true;
};
RigidCircle.prototype.collidedCircRect = function(rect) {
    
};

RigidCircle.prototype.collision = function(rigidShape) {
  var type = rigidShape.getType();
  var cInfo = new CollisionInfo();
  var collision = false;
  switch(type) {
      case "RigidRectangle":
          collision = rigidShape.collidedRectCirc(this, cInfo);
          break;
      case "RigidCircle":
          collision = this.collidedCircCirc(this, rigidShape, cInfo);
          break;
  }
  if(collision) {
    return cInfo;
  } else {
    return null;
  }
};
