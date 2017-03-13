/* 
 * File:RigidCircle.js
 *      define a circle
 *     
 */
/*jslint node: true, vars: true, evil: true, bitwise: true */
"use strict";
/* global RigidShape, vec2, gEngine */

var RigidCircle = function (xf, radius) {
    RigidShape.call(this, xf);
    this.mType = "RigidCircle";
    this.mRadius = radius;
    this.mBoundRadius = radius;
};
gEngine.Core.inheritPrototype(RigidCircle, RigidShape);

RigidCircle.prototype.incShapeSizeBy= function (dt) {
    this.mRadius += dt;
};

RigidCircle.prototype.move = function(vector) {
    var pos = this.mXform.getPosition();
    vec2.add(pos, pos, vector);
    return this;
};

RigidCircle.prototype.rotate = function(angle) {
    this.mAngle += angle;
    var center = this.mXform.getPosition();
    this.mXform.setRotationInRad(this.mAngle);
    var radianAngle = this.mXform.getRotationInRad();
    vec2.rotateWRT(center, center, radianAngle, center);
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
    
    if (this.mDrawBounds)
        this.drawCircle(aCamera, this.mBoundRadius);
};

RigidCircle.prototype.update = function () {
    RigidShape.prototype.update.call(this);
};

RigidCircle.prototype.updateInertia = function () {
    if (this.mInvMass === 0) {
        this.mInertia = 0;
    } else {
        // this.mInvMass is inverted!!
        // Inertia=mass * radius^2
        // 12 is a constant value that can be changed
        this.mInertia = (1 / this.mInvMass) * (this.mRadius * this.mRadius) / 12;
    }
};