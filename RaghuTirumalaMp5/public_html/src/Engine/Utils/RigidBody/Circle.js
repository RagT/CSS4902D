/* 
 * File:Circle.js
 *      define a circle
 *     
 */

/*jslint node: true, vars: true, evil: true, bitwise: true */
/* global RigidShape, vec2, mCenter */

"use strict";

var Circle = function (center, radius, showRigid) {
    RigidShape.call(this, center);
    this.mType = "Circle";
    this.mBoundRadius = radius;
    this.mRigidRadius = radius;
    this.showRigid = showRigid;
};

var prototype = Object.create(RigidShape.prototype);
prototype.constructor = Circle;
Circle.prototype = prototype;

Circle.prototype.move = function (s) {
    vec2.add(this.mStartPoint, this.mStartPoint, s);
    vec2.add(this.mCenter, this.mCenter, s);
    return this;
};

Circle.prototype.draw = function (camera) {
    if(this.showRigid) {
        this.drawCircle(this.mRigidRadius, 30, [0,0,0,1], camera);
    }
    this.drawCircle(this.mBoundRadius, 30, [1,1,1,1], camera);
};

//rotate angle in counterclockwise
Circle.prototype.rotate = function (angle) {
    this.mAngle += angle;
    this.mStartpoint = this.mStartpoint.rotate(this.mCenter, angle);
    return this;
};

Circle.prototype.updatePosAndRad= function(center, rad) {
    this.mBoundRadius = rad;
    this.mCenter = center;
};

Circle.prototype.incRadBy = function(delta) {
    if(this.mBoundRadius + delta > 0) 
        this.mBoundRadius += delta;
};

Circle.prototype.drawCircle = function(radius, num_segments, color, camera) {
    var vertices = []; //get vertices on circle
    for(var i = 0; i < num_segments; i++) {
        var theta = 2.0 * Math.PI * i / num_segments; 
        
        var x = radius * Math.cos(theta);
        var y = radius * Math.sin(theta);
        
        vertices.push([this.mCenter[0] + x, this.mCenter[1] + y]);
    }
    
    //Draw lines
    for(var i = 0; i < num_segments - 1; i++) {
        var line = new LineRenderable(vertices[i][0], vertices[i][1], 
                                      vertices[i+1][0], vertices[i+1][1]);
        line.setColor(color);                              
        line.draw(camera);                              
    }
    var lastLine = new LineRenderable(vertices[num_segments - 1][0], vertices[num_segments - 1][1],
                                      vertices[0][0], vertices[0][1]);
    lastLine.setColor(color);                                  
    lastLine.draw(camera);
};