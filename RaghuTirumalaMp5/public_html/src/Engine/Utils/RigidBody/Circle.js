/* 
 * File:Circle.js
 *      define a circle
 *     
 */

/*jslint node: true, vars: true, evil: true, bitwise: true */
/* global RigidShape, vec2 */

"use strict";

var Circle = function (center, radius) {
    RigidShape.call(this, center);
    this.mType = "Circle";
    this.mRadius = radius;
    this.mBoundRadius = radius;
    //The start point of line in circle
    this.mStartpoint = vec2.fromValues(center[0], center[1] - radius);
};

var prototype = Object.create(RigidShape.prototype);
prototype.constructor = Circle;
Circle.prototype = prototype;

Circle.prototype.move = function (s) {
    vec2.add(this.mStartPoint, this.mStartPoint, s);
    vec2.add(this.mCenter, this.mCenter, s);
    return this;
};

Circle.prototype.draw = function (context) {

};

//rotate angle in counterclockwise
Circle.prototype.rotate = function (angle) {
    this.mAngle += angle;
    this.mStartpoint = this.mStartpoint.rotate(this.mCenter, angle);
    return this;
};

Circle.prototype.getRadius = function() {
    return this.mBoundRadius;
};

Circle.prototype.updatePosAndRad= function(center, rad) {
    this.mRadius = rad;
    this.mBoundRadius = rad;
    //The start point of line in circle
    this.mStartpoint = vec2.fromValues(center.x, center.y - rad);
};