/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*jslint node: true, vars: true, evil: true, bitwise: true */
/* global RigidShape, vec2 */

"use strict";

var Rectangle = function (center, width, height) {

    RigidShape.call(this, center);
    this.mType = "Rectangle";
    this.mWidth = width;
    this.mHeight = height;
    this.mBoundRadius = Math.sqrt(width * width + height * height) / 2;
    this.mVertex = [];
    this.mFaceNormal = [[0,0], [0,0], [0,0], [0,0]];

    //0--TopLeft;1--TopRight;2--BottomRight;3--BottomLeft
    this.mVertex[0] = vec2.fromValues(center[0] - width / 2, center[1] - height / 2);
    this.mVertex[1] = vec2.fromValues(center[0] + width / 2, center[1] - height / 2);
    this.mVertex[2] = vec2.fromValues(center[0] + width / 2, center[1] + height / 2);
    this.mVertex[3] = vec2.fromValues(center[0] - width / 2, center[1] + height / 2);

    //0--Top;1--Right;2--Bottom;3--Left
    //mFaceNormal is normal of face toward outside of rectangle
    this.calcNormals();
    
    var topColor = [1,0,0,1];
    var bottomColor = [0,1,0,1];
    var leftColor = [0,0,1,1];
    var rightColor = [1,1,0,1];
    
    //Renderables to show rectangle
    this.top = new LineRenderable();
    this.top.setColor(topColor);                              
    this.bottom = new LineRenderable();
    this.bottom.setColor(bottomColor);                              
    this.left = new LineRenderable();
    this.left.setColor(leftColor);                              
    this.right = new LineRenderable();  
    this.right.setColor(rightColor);    
    
    //Renderables for normal vectors
    this.topNormal = new LineRenderable();
    this.topNormal.setColor(topColor);
    this.bottomNormal = new LineRenderable();
    this.bottomNormal.setColor(bottomColor);
    this.leftNormal = new LineRenderable();
    this.leftNormal.setColor(leftColor);
    this.rightNormal = new LineRenderable();
    this.rightNormal.setColor(rightColor);
    
    this.updateLines();
    
    this.boundCircle = new Circle(this.mCenter, this.mBoundRadius);
};

var prototype = Object.create(RigidShape.prototype);
prototype.constructor = Rectangle;
Rectangle.prototype = prototype;

Rectangle.prototype.rotate = function (angle) {
    this.mAngle += angle;
    var i;
    for (i = 0; i < this.mVertex.length; i++) {
        this.mVertex[i] = this.mVertex[i].rotate(this.mCenter, angle);
    }
    this.calcNormals();
    return this;
};

Rectangle.prototype.calcNormals = function(){
    vec2.subtract(this.mFaceNormal[0], this.mVertex[1], this.mVertex[2]);
    vec2.normalize(this.mFaceNormal[0], this.mFaceNormal[0]);
    vec2.subtract(this.mFaceNormal[1], this.mVertex[2], this.mVertex[3]);
    vec2.normalize(this.mFaceNormal[1], this.mFaceNormal[1]);
    vec2.subtract(this.mFaceNormal[2], this.mVertex[3], this.mVertex[0]);
    vec2.normalize(this.mFaceNormal[2], this.mFaceNormal[2]);
    vec2.subtract(this.mFaceNormal[3], this.mVertex[0], this.mVertex[1]);
    vec2.normalize(this.mFaceNormal[3], this.mFaceNormal[3]);
    
    //Scale to desired length
    var length = 3;
    for(var i = 0; i < 4; i++){
        vec2.scale(this.mFaceNormal[i], this.mFaceNormal[i], length);
    }
};

Rectangle.prototype.draw = function (camera) {
    this.top.draw(camera);
    this.bottom.draw(camera);
    this.left.draw(camera);
    this.right.draw(camera);
    this.topNormal.draw(camera);
    this.bottomNormal.draw(camera);
    this.leftNormal.draw(camera);
    this.rightNormal.draw(camera);
    this.boundCircle.draw(camera);
};

Rectangle.prototype.updatePos = function(center){
    //0--TopLeft;1--TopRight;2--BottomRight;3--BottomLeft
    this.mCenter = center;
    this.mVertex[0] = vec2.fromValues(center[0] - this.mWidth / 2, center[1]- this.mHeight / 2);
    this.mVertex[1] = vec2.fromValues(center[0] + this.mWidth / 2, center[1]- this.mHeight / 2);
    this.mVertex[2] = vec2.fromValues(center[0] + this.mWidth / 2, center[1]+ this.mHeight / 2);
    this.mVertex[3] = vec2.fromValues(center[0] - this.mWidth / 2, center[1]+ this.mHeight / 2);
    for(var i = 0; i < this.mVertex.length; i++){
        vec2.rotateWRT(this.mVertex[i], this.mVertex[i], this.mAngle, this.mCenter);
    }
    
    //0--Top;1--Right;2--Bottom;3--Left
    //mFaceNormal is normal of face toward outside of rectangle
    this.calcNormals();
    this.updateLines();
    this.boundCircle.updatePosAndRad(center, this.mBoundRadius);
};

Rectangle.prototype.updateLines = function() {
    this.top.setVertices(this.mVertex[0][0], this.mVertex[0][1], 
                                  this.mVertex[1][0], this.mVertex[1][1]);
    this.bottom.setVertices(this.mVertex[2][0], this.mVertex[2][1], 
                                  this.mVertex[3][0], this.mVertex[3][1]);
    this.left.setVertices(this.mVertex[0][0], this.mVertex[0][1], 
                                  this.mVertex[3][0], this.mVertex[3][1]);
    this.right.setVertices(this.mVertex[1][0], this.mVertex[1][1], 
                                  this.mVertex[2][0], this.mVertex[2][1]);
                             
    var normalEnd = [];
    for(var i = 0; i < 4; i++) {
        var endPoint = [0,0];
        var vertex = i + 1;
        if(vertex > 3) {
            vertex = 0;
        }
        vec2.add(endPoint, this.mVertex[vertex], this.mFaceNormal[i]);
        normalEnd.push(endPoint);
    }
    
    this.topNormal.setVertices(this.mVertex[1][0], this.mVertex[1][1],
                               normalEnd[0][0], normalEnd[0][1]);
    this.bottomNormal.setVertices(this.mVertex[3][0], this.mVertex[3][1],
                               normalEnd[2][0], normalEnd[2][1]);
    this.leftNormal.setVertices(this.mVertex[0][0], this.mVertex[0][1],
                               normalEnd[3][0], normalEnd[3][1]);
    this.rightNormal.setVertices(this.mVertex[2][0], this.mVertex[2][1],
                               normalEnd[1][0], normalEnd[1][1]);                           
                               
                               
};

Rectangle.prototype.getRadius = function() {
    return this.mBoundRadius;
};

Rectangle.prototype.rotate = function(angleInRad) {
    for(var i = 0; i < this.mVertex.length; i++){
        vec2.rotateWRT(this.mVertex[i], this.mVertex[i], angleInRad, this.mCenter);
    }
    this.mAngle += angleInRad;
    this.calcNormals();
    this.updateLines();
};

