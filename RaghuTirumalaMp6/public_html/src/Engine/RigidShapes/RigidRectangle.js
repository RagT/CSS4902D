/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/*jslint node: true, vars: true, evil: true, bitwise: true */
"use strict";
/* global RigidShape, vec2, gEngine */

var RigidRectangle = function (xf, width, height) {
    RigidShape.call(this, xf);
    this.mType = "RigidRectangle";
    this.mWidth = width;
    this.mHeight = height;
    this.mBoundRadius = Math.sqrt(width * width + height * height) / 2;
    this.mVertex = [];
    this.mFaceNormal = [];
    
    this.setVertices();
    this.computeFaceNormals();
};
gEngine.Core.inheritPrototype(RigidRectangle, RigidShape);

RigidRectangle.prototype.setVertices = function () {
    var center = this.mXform.getPosition();
    var hw = this.mWidth / 2;
    var hh = this.mHeight / 2;
    //0--TopLeft;1--TopRight;2--BottomRight;3--BottomLeft
    this.mVertex[0] = vec2.fromValues(center[0] - hw, center[1] - hh);
    this.mVertex[1] = vec2.fromValues(center[0] + hw, center[1] - hh);
    this.mVertex[2] = vec2.fromValues(center[0] + hw, center[1] + hh);
    this.mVertex[3] = vec2.fromValues(center[0] - hw, center[1] + hh);    
};

RigidRectangle.prototype.computeFaceNormals = function () {
    //0--Top;1--Right;2--Bottom;3--Left
    //mFaceNormal is normal of face toward outside of rectangle    
    for (var i = 0; i<4; i++) {
        var v = (i+1) % 4;
        var nv = (i+2) % 4;
        this.mFaceNormal[i] = vec2.clone(this.mVertex[v]);
        vec2.subtract(this.mFaceNormal[i], this.mFaceNormal[i], this.mVertex[nv]);
        vec2.normalize(this.mFaceNormal[i], this.mFaceNormal[i]);
    }
};

RigidRectangle.prototype.rotateVertices = function () {
    var center = this.mXform.getPosition();
    var r = this.mXform.getRotationInRad();
    for (var i = 0; i<4; i++) {
        vec2.rotateWRT(this.mVertex[i], this.mVertex[i], r, center);
    }
    this.computeFaceNormals();
};

RigidRectangle.prototype.travel = function (dt) {
    var p = this.mXform.getPosition();
    // Linear
    vec2.scaleAndAdd(p, p, this.mVelocity, dt);
    this.setVertices();
    
    // angular motion
    this.rotateVertices();
    
    return this;
};


RigidRectangle.kBoundColor = [
    [1, 1, 0, 1],
    [1, 0, 0, 1],
    [0, 0, 1, 1],
    [0, 1, 1, 1]
];
RigidRectangle.prototype.drawAnEdge = function (i1, i2, aCamera) {
    this.mLine.setColor(RigidRectangle.kBoundColor[i1]);
    this.mLine.setFirstVertex(this.mVertex[i1][0], this.mVertex[i1][1]);  
    this.mLine.setSecondVertex(this.mVertex[i2][0], this.mVertex[i2][1]); 
    this.mLine.draw(aCamera);
    var n = [3*this.mFaceNormal[i1][0], 3*this.mFaceNormal[i1][1]];
    vec2.add(n, this.mVertex[i1], n);
    this.mLine.setSecondVertex(n[0], n[1]); 
    this.mLine.draw(aCamera);
};

RigidRectangle.prototype.draw = function (aCamera) {
    RigidShape.prototype.draw.call(this, aCamera);
    var i = 0;
    for (i=0; i<4; i++) {
        this.drawAnEdge(i, (i+1)%4, aCamera);
    }
    
    if(this.getShowBounds()) {
        this.mLine.setColor([1, 1, 1, 1]);
        this.drawCircle(aCamera, this.mBoundRadius);
    }
};

RigidRectangle.prototype.update = function () {
    RigidShape.prototype.update.call(this);
};

//Collision Handling Functions
var SupportStruct = function () {
    this.mSupportPoint = vec2.fromValues(0,0);
    this.mSupportPointDist = 0;
};
var tmpSupport = new SupportStruct();

RigidRectangle.prototype.findSupportPoint = function (dir, ptOnEdge) {
    //the longest project length
    var vToEdge = vec2.fromValues(0,0);
    var projection = vec2.fromValues(0,0);

    tmpSupport.mSupportPointDist = -9999999;
    tmpSupport.mSupportPoint = null;
    //check each vector of other object
    for (var i = 0; i < this.mVertex.length; i++) {
        vec2.subtract(vToEdge, this.mVertex[i], ptOnEdge);
        projection = vec2.dot(vToEdge, dir);
        
        //find the longest distance with certain edge
        //dir is -n direction, so the distance should be positive       
        if ((projection > 0) && (projection > tmpSupport.mSupportPointDist)) {
            tmpSupport.mSupportPoint = this.mVertex[i];
            tmpSupport.mSupportPointDist = projection;
        }
    }
};

/**
 * Find the shortest axis that overlapping
 * @param {Rectangle} otherRect  another rectangle that being tested
 * @param {CollisionInfo} collisionInfo  record the collision information
 * @returns {Boolean} true if has overlap part in all four directions.
 */
RigidRectangle.prototype.findAxisLeastPenetration = function (otherRect, collisionInfo) {

    var n;
    var supportPoint;

    var bestDistance = 999999;
    var bestIndex = null;

    var hasSupport = true;
    var i = 0;

    while ((hasSupport) && (i < this.mFaceNormal.length)) {
        // Retrieve a face normal from A
        n = this.mFaceNormal[i];

        // use -n as direction and the vertex on edge i as point on edge
        var dir = vec2.fromValues(0,0);
        vec2.scale(dir, n, -1);
        var ptOnEdge = this.mVertex[i];
        // find the support on B
        // the point has longest distance with edge i 
        otherRect.findSupportPoint(dir, ptOnEdge);
        hasSupport = (tmpSupport.mSupportPoint !== null);
        
        //get the shortest support point depth
        if ((hasSupport) && (tmpSupport.mSupportPointDist < bestDistance)) {
            bestDistance = tmpSupport.mSupportPointDist;
            bestIndex = i;
            supportPoint = tmpSupport.mSupportPoint;
        }
        i = i + 1;
    }
    if (hasSupport) {
        //all four directions have support point
        var bestVec = vec2.fromValues(0,0);
        vec2.scale(bestVec, this.mFaceNormal[bestIndex], bestDistance);
        var start = vec2.fromValues(0,0);
        vec2.add(start, supportPoint, bestVec);
        collisionInfo.setInfo(bestDistance, this.mFaceNormal[bestIndex], start);
    }
    return hasSupport;
};
/**
 * Check for collision between RigidRectangle and RigidRectangle
 * @param {Rectangle} r1 Rectangle object to check for collision status
 * @param {Rectangle} r2 Rectangle object to check for collision status against
 * @param {CollisionInfo} collisionInfo Collision info of collision
 * @returns {Boolean} true if collision occurs
 */    

RigidRectangle.prototype.collidedRectRect = function (r1, r2, collisionInfo) {
    var collisionInfoR1 = new CollisionInfo();
    var collisionInfoR2 = new CollisionInfo();
    
    var status1 = false;
    var status2 = false;

    //find Axis of Separation for both rectangle
    status1 = r1.findAxisLeastPenetration(r2, collisionInfoR1);

    if (status1) {
        status2 = r2.findAxisLeastPenetration(r1, collisionInfoR2);
        if (status2) {
            //if both of rectangles are overlapping, choose the shorter normal as the normal       
            if (collisionInfoR1.getDepth() < collisionInfoR2.getDepth()) {
                var depthVec = vec2.fromValues(0,0);
                vec2.scale(depthVec, collisionInfoR1.getNormal(), collisionInfoR1.getDepth());
                var start = vec2.fromValues(0,0);
                vec2.subtract(start, collisionInfoR1.mStart, depthVec);
                collisionInfo.setInfo(collisionInfoR1.getDepth(), collisionInfoR1.getNormal(), start);
            } else {
                var normal = vec2.fromValues(0,0);
                vec2.normalize(normal, collisionInfoR2.getNormal(), -1);
                collisionInfo.setInfo(collisionInfoR2.getDepth(), normal, collisionInfoR2.mStart);
            }
        } 
    } 
    return status1 && status2;
};

/**
 * Check for collision between Rectangle and Circle
 * @param {Circle} otherCir circle to check for collision status against
 * @param {CollisionInfo} collisionInfo Collision info of collision
 * @returns {Boolean} true if collision occurs
 * @memberOf Rectangle
 */
RigidRectangle.prototype.collidedRectCirc = function (otherCir, collisionInfo) {
    var inside = true;
    var bestDistance = -99999;
    var nearestEdge = 0;
    var i;
    var v = vec2.fromValues(0,0);
    var circ2Pos, projection;
    for (i = 0; i < 4; i++) {
        //find the nearest face for center of circle        
        circ2Pos = otherCir.getPosition();
        vec2.subtract(v, circ2Pos, this.mVertex[i]);
        projection = vec2.dot(v, this.mFaceNormal[i]);
        if (projection > 0) {
            //if the center of circle is outside of rectangle
            bestDistance = projection;
            nearestEdge = i;
            inside = false;
            break;
        }
        if (projection > bestDistance) {
            bestDistance = projection;
            nearestEdge = i;
        }
    }
    var dis;
    var normal = vec2.fromValues(0,0);
    var radiusVec = vec2.fromValues(0,0);
    if (!inside) {
        //the center of circle is outside of rectangle

        //v1 is from left vertex of face to center of circle 
        //v2 is from left vertex of face to right vertex of face
        var v1 = vec2.fromValues(0,0);
        vec2.subtract(v1, circ2Pos, this.mVertex[nearestEdge]);
        var v2 = vec2.fromValues(0,0);
        vec2.subtract(v2, this.mVertex[(nearestEdge + 1) % 4], this.mVertex[nearestEdge]);
        
        var dot = vec2.dot(v1,v2);

        if (dot < 0) {
            //the center of circle is in corner region of mVertex[nearestEdge]
            dis = vec2.length(v1);
            //compare the distance with radium to decide collision
            if (dis > otherCir.mBoundRadius) {
                return false;
            }

            normal = vec2.fromValues(0,0);
            vec2.normalize(normal, v1);
            radiusVec = vec2.fromValues(0,0);
            vec2.scale(radiusVec, normal, -otherCir.mBoundRadius);
            var start = vec2.fromValues(0,0);
            vec2.add(start, circ2Pos, radiusVec);
            collisionInfo.setInfo(otherCir.mBoundRadius - dis, normal, start);
        } else {
            //the center of circle is in corner region of mVertex[nearestEdge+1]

            //v1 is from right vertex of face to center of circle 
            //v2 is from right vertex of face to left vertex of face
            vec2.subtract(v1, circ2Pos, this.mVertex[(nearestEdge + 1) % 4]);
            vec2.scale(v2, v2, -1);
            dot = vec2.dot(v1, v2);
            if (dot < 0) {
                dis = vec2.length(v1);
                //compare the distance with radium to decide collision
                if (dis > otherCir.mBoundRadius) {
                    return false;
                }
                vec2.normalize(normal, normal);
                vec2.scale(radiusVec, normal, -otherCir.mBoundRadius);
                var start = vec2.fromValues(0,0);
                vec2.add(start, circ2Pos, radiusVec);
                collisionInfo.setInfo(otherCir.mBoundRadius - dis, normal, start);
            } else {
                //the center of circle is in face region of face[nearestEdge]
                if (bestDistance < otherCir.mBoundRadius) {
                    vec2.scale(radiusVec, this.mFaceNormal[nearestEdge], otherCir.mBoundRadius);
                    var start = vec2.fromValues(0,0);
                    vec2.subtract(start, circ2Pos, radiusVec);
                    collisionInfo.setInfo(otherCir.mBoundRadius - bestDistance, this.mFaceNormal[nearestEdge], start);
                } else {
                    return false;
                }
            }
        }
    } else {
        //the center of circle is inside of rectangle
        vec2.scale(radiusVec, this.mFaceNormal[nearestEdge], otherCir.mBoundRadius);
        var start = vec2.fromValues(0,0);
        vec2.subtract(start, circ2Pos, radiusVec);
        collisionInfo.setInfo(otherCir.mBoundRadius - bestDistance, this.mFaceNormal[nearestEdge], start);
    }
    return true;
};

RigidRectangle.prototype.collision = function(rigidShape) {
  var type = rigidShape.getType();
  var cInfo = new CollisionInfo();
  var collision = false;
  switch(type) {
      case "RigidRectangle":
          collision = this.collidedRectRect(this, rigidShape, cInfo);
          break;
      case "RigidCircle":
          collision = this.collidedRectCirc(rigidShape, cInfo);
          break;
  }
  if(collision) {
    return cInfo;
  } else {
    return null;
  }
};