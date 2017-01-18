/*
 * File: SceneFile_Parse.js 
 */
/*jslint node: true, vars: true */
/*global gEngine: false, console: false, Camera: false, vec2: false, Renderable: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function SceneFileParser(sceneFilePath, resourceType) {
    this.mScene = gEngine.ResourceMap.retrieveAsset(sceneFilePath);
    this.mResourceType = resourceType;
}

SceneFileParser.prototype._getElm = function (tagElm) {
    var theElm;
    if(this.mResourceType === "XML") {
        theElm = this.mScene.getElementsByTagName(tagElm);
        if (theElm.length === 0) {
            console.error("Warning: Level element:[" + tagElm + "]: is not found!");
        }
    }
    if(this.mResourceType === "JSON") {
        var sceneInfo = JSON.parse(mScene);
        theElm = sceneInfo[tagElm];
        if(theElm.length === 0) {
            console.error("Warning: Level element:[" + tagElm + "]: is not found!");
        }
    }
    return theElm;
};

SceneFileParser.prototype.parseCamera = function () {
    var camElm = this._getElm("Camera");
    var cx;
    var cy;
    var w;
    var viewport;
    var bgColor;
    
    if(this.mResourceType === "XML") {
        cx = Number(camElm[0].getAttribute("CenterX"));
        cy = Number(camElm[0].getAttribute("CenterY"));
        w = Number(camElm[0].getAttribute("Width"));
        viewport = camElm[0].getAttribute("Viewport").split(" ");
        bgColor = camElm[0].getAttribute("BgColor").split(" ");
        
        // make sure viewport and color are number
        var j;
        for (j = 0; j < 4; j++) {
            bgColor[j] = Number(bgColor[j]);
            viewport[j] = Number(viewport[j]);
        }
    }
    if(this.mResourceType === "JSON") {
        cx = camElm.Center[0];
        cy = camElm.Center[1];
        w = camElm.Width;
        viewport = camElm.ViewPort;
        bgColor = camElm.BgColor;
    }


    var cam = new Camera(
        vec2.fromValues(cx, cy),  // position of the camera
        w,                        // width of camera
        viewport                  // viewport (orgX, orgY, width, height)
        );
    cam.setBackgroundColor(bgColor);
    return cam;
};

SceneFileParser.prototype.parseSquares = function (sqSet) {
    var i, j, x, y, w, h, r, c, sq;
    var elm = this._getElm("Square");
    if(this.mResourceType === "XML") {
        for (i = 0; i < elm.length; i++) {
            x = Number(elm.item(i).attributes.getNamedItem("PosX").value);
            y = Number(elm.item(i).attributes.getNamedItem("PosY").value);
            w = Number(elm.item(i).attributes.getNamedItem("Width").value);
            h = Number(elm.item(i).attributes.getNamedItem("Height").value);
            r = Number(elm.item(i).attributes.getNamedItem("Rotation").value);
            c = elm.item(i).attributes.getNamedItem("Color").value.split(" ");
            sq = new Renderable(gEngine.DefaultResources.getConstColorShader());
        }
        // make sure color array contains numbers
        for (j = 0; j < 4; j++) {
            c[j] = Number(c[j]);
        }
    }
    if(this.mResourceType === "JSON") {
        for(i = 0; i < elm.length; i++) {
            x = elm[i].Pos[0];
            y = elm[i].Pos[1];
            w = elm[i].Width;
            h = elm[i].Height;
            r = elm[i].Rotation;
            c = elm[i].Color;
        }
    }

    sq.setColor(c);
    sq.getXform().setPosition(x, y);
    sq.getXform().setRotationInDegree(r); // In Degree
    sq.getXform().setSize(w, h);
    sqSet.push(sq);    
};
