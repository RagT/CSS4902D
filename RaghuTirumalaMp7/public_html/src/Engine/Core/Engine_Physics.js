/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/*jslint node: true, vars: true, white: true */
/*global vec2, CollisionInfo */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

/**
 * Static refrence to gEngine
 * @type gEngine
 */
var gEngine = gEngine || { };
    // initialize the variable while ensuring it is not redefined

/**
 * Default Constructor<p>
 * Physics engine supporting projection and impulse collision resolution. <p>
 * @class gEngine.Physics
 * @type gEngine.Physics
 */
gEngine.Physics = (function () {

    var mPositionalCorrectionFlag = true;
    var mRelaxationCount = 15;                  // number of relaxation iteration
    var mPosCorrectionRate = 0.8;               // percentage of separation to project objects
    
    var getSystemtAcceleration = function() { return vec2.fromValues(0, -20); };
    
    var positionalCorrection = function (s1, s2, collisionInfo) {
        var s1InvMass = s1.getInvMass();
        var s2InvMass = s2.getInvMass();

        var num = collisionInfo.getDepth() / (s1InvMass + s2InvMass) * mPosCorrectionRate;
        var correctionAmount = vec2.fromValues(0,0);
        vec2.scale(correctionAmount, collisionInfo.getNormal(), num);
        
        var s1MoveDist = vec2.fromValues(0,0);
        var s2MoveDist = vec2.fromValues(0,0);
        vec2.scale(s1MoveDist, correctionAmount, -s1InvMass);
        vec2.scale(s2MoveDist, correctionAmount, s2InvMass);
        s1.move(s1MoveDist);
        s2.move(s2MoveDist);
    };
    
    var cross = function(v1, v2) {
        return (v1[0] * v2[1] - v1[1] * v2[0]);
    };
    
    var resolveCollision = function (s1, s2, collisionInfo) {

        if ((s1.mInvMass === 0) && (s2.mInvMass === 0)) {
            return;
        }
        
        //  correct positions
        if (mPositionalCorrectionFlag) {
            positionalCorrection(s1, s2, collisionInfo);
        }
        
        var n = collisionInfo.getNormal();
        
        //the direction of collisionInfo is always from s1 to s2
        //but the Mass is inversed, so start scale with s2 and end scale with s1
        var start = vec2.fromValues(0,0);
        var end = vec2.fromValues(0,0);
        var p = vec2.fromValues(0,0);
        vec2.scale(start, collisionInfo.getStart(), (s2.getInvMass() / (s1.getInvMass() + s2.getInvMass())));
        vec2.scale(end, collisionInfo.getEnd(), (s1.getInvMass() / (s1.getInvMass() + s2.getInvMass())));
        vec2.add(p, start, end);
        
        //r is vector from center of object to collision point
        var r1 = vec2.fromValues(0,0);
        var r2 = vec2.fromValues(0,0);
        vec2.subtract(r1, p, s1.getXform().getPosition());
        vec2.subtract(r2, p, s2.getXform().getPosition());
        
        //newV = V + mAngularVelocity cross R
        var v1 = vec2.fromValues(0,0);
        var v2 = vec2.fromValues(0,0);
        vec2.add(v1, s1.getVelocity(), vec2.fromValues(-1 * s1.getAngularVelocity() * r1[1], s1.getAngularVelocity() * r1[0]));
        vec2.add(v2, s2.getVelocity(), vec2.fromValues(-1 * s2.getAngularVelocity() * r2[1], s2.getAngularVelocity() * r2[0]));
        var relativeVelocity = vec2.fromValues(0,0);
        vec2.subtract(relativeVelocity, v2, v1);
        
        // Relative velocity in normal direction
        var rVelocityInNormal = vec2.dot(relativeVelocity, n);

        //if objects moving apart ignore
        if (rVelocityInNormal > 0) {
            return;
        }
        
        // compute and apply response impulses for each object    
        var newRestituion = Math.min(s1.mRestitution, s2.mRestitution);
        var newFriction = Math.min(s1.mFriction, s2.mFriction);

        //R cross N
        var R1crossN = cross(r1, n);
        var R2crossN = cross(r2, n);
        
        // Calc impulse scalar
        // the formula of jN can be found in http://www.myphysicslab.com/collision.html
        var jN = -(1 + newRestituion) * rVelocityInNormal;
        jN = jN / (s1.getInvMass() + s2.getInvMass() +
                R1crossN * R1crossN * s1.getInertia() +
                R2crossN * R2crossN * s2.getInertia());
        
        //impulse is in direction of normal ( from s1 to s2)
        var impulse = vec2.fromValues(0,0);
        vec2.scale(impulse, n, jN);
        
        var scaleImpulse = vec2.fromValues(0,0);
        vec2.scale(scaleImpulse, impulse, -s1.getInvMass());
        s1.incVelocityBy(scaleImpulse);
        
        vec2.scale(scaleImpulse, impulse, s2.getInvMass());
        s2.incVelocityBy(scaleImpulse);
        
        s1.incAngularVelocity(-1 * R1crossN * jN * s1.getInertia());
        s2.incAngularVelocity(R2crossN * jN * s2.getInertia());

        
        var tangent = vec2.fromValues(0,0);
        var scaleN = vec2.fromValues(0,0);
        var dotRelative = vec2.dot(relativeVelocity, n);
        
        vec2.scale(scaleN, n, dotRelative);
        vec2.subtract(tangent, relativeVelocity, scaleN);
        vec2.normalize(tangent, tangent);
        vec2.scale(tangent, tangent, -1);
        
        var R1crossT = cross(r1, tangent);
        var R2crossT = cross(r2,tangent);
 
        var jT = -(1 + newRestituion) * vec2.dot(relativeVelocity, tangent) * newFriction;
        jT = jT / (s1.getInvMass() + s2.getInvMass() + R1crossT * R1crossT * s1.getInertia()
                + R2crossT * R2crossT * s2.getInertia());
        
        //friction should less than force in normal direction
        if (jT > jN) {
            jT = jN;
        }
        
        vec2.scale(impulse, tangent, jT);
        var impulseS1 = vec2.fromValues(0,0);
        var impulseS2 = vec2.fromValues(0,0);
        
        vec2.scale(impulseS1, impulse, -s1.getInvMass());
        vec2.scale(impulseS2, impulse, s2.getInvMass());
        
        s1.incVelocityBy(impulseS1);
        s2.incVelocityBy(impulseS2);
        
        s1.incAngularVelocity(-1 * R1crossT * jT * s1.getInertia());
        s2.incAngularVelocity(R2crossT * jT * s2.getInertia());
        
    };
    
    //Get all collision info objects
    var processCollision = function(set, infoSet) {
        var i = 0, j, k;
        var iToj = [0, 0];
        
        for(k = 0; k < mRelaxationCount; k++) {
            var info = new CollisionInfo();
            for (i = 0; i<set.size(); i++) {
                var objI = set.getObjectAt(i).getRigidBody();
                for (j = i+1; j<set.size(); j++) {
                    var objJ = set.getObjectAt(j).getRigidBody();
                    if (objI.boundTest(objJ)) {
                        if (objI.collisionTest(objJ, info)) {
                            // make sure info is always from i towards j
                            vec2.subtract(iToj, objJ.getCenter(), objI.getCenter());
                            if (vec2.dot(iToj, info.getNormal()) < 0)
                                info.changeDir();
                            infoSet.push(info);
                            resolveCollision(set.getObjectAt(i).getRigidBody(), 
                            set.getObjectAt(j).getRigidBody(), info);
                            info = new CollisionInfo();
                        }
                    }
                }
            }
        }
    };
    
    var mPublic = {
        getSystemAcceleration: getSystemtAcceleration,
        processCollision: processCollision,
        mPositionalCorrectionFlag: mPositionalCorrectionFlag
    };
    return mPublic;
}());