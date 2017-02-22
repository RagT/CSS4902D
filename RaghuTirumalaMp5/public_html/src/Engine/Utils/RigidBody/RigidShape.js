/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/*jslint node: true, vars: true, evil: true, bitwise: true */
/* global gEngine, vec2 */

"use strict";

function RigidShape(center) {
    this.mCenter = center;

    //angle
    this.mAngle = 0;

    this.mBoundRadius = 0;
}


RigidShape.prototype.update = function () {

};

RigidShape.prototype.boundTest = function (otherShape) {
    var vFrom1to2  = vec2.fromValues(0, 0);
    vec2.subtract(vFrom1to2, otherShape.mCenter, this.mCenter);
    var rSum = this.mBoundRadius + otherShape.mBoundRadius;
    var dist = vec2.length(vFrom1to2);
    if (dist > rSum) {
        //not overlapping
        return false;
    }
    return true;
};

RigidShape.prototype.getRadius = function() {
    return this.mBoundRadius;
};