/*
 * File: BlueLevel.js 
 * This is the logic of our game. 
 */
/*jslint node: true, vars: true */
/*global gEngine: false, Scene: false, MyGame: false, SceneFileParser: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function BlueLevel() {
    // audio clips: supports both mp3 and wav formats
    this.kBgClip = "assets/sounds/BGClip.mp3";

    // scene file name
    this.kSceneFile = "assets/BlueLevel.xml";
    // all squares
    this.mSqSet = [];        // these are the Renderable objects

    // The camera to view the scene
    this.mCamera = null;
    
    this.timeOfLastUpdate = Date.now();
    
    this.cam2Viewport = "cam2Viewport";
    //smaller camera
    this.mCamera2 = null;
}
gEngine.Core.inheritPrototype(BlueLevel, Scene);

BlueLevel.prototype.loadScene = function () {
    // load the scene file
    gEngine.TextFileLoader.loadTextFile(this.kSceneFile, gEngine.TextFileLoader.eTextFileType.eXMLFile);

    // loads the audios
    gEngine.AudioClips.loadAudio(this.kBgClip);
    gEngine.ResourceMap.loadCam2ViewPort(this.cam2Viewport);
};

BlueLevel.prototype.unloadScene = function () {
    // stop the background audio
    gEngine.AudioClips.stopBackgroundAudio();

    // unload the scene file and loaded resources
    gEngine.TextFileLoader.unloadTextFile(this.kSceneFile);
    gEngine.AudioClips.unloadAudio(this.kBgClip);
    
    gEngine.ResourceMap.loadCam2ViewPort(this.cam2Viewport, this.mCamera2.getViewport());
    var nextLevel = new MyGame();  // load the next level
    gEngine.Core.startScene(nextLevel);
};

BlueLevel.prototype.initialize = function () {
    var sceneParser = new SceneFileParser(this.kSceneFile, "XML");
    var smallViewport = gEngine.ResourceMap.retrieveAsset(this.cam2Viewport);
    // Step A: Read in the camera
    this.mCamera = sceneParser.parseCamera();
        this.mCamera2 = new Camera(
        vec2.fromValues(20, 60),  // position of the camera
        20,                        // width of camera
        smallViewport                  // viewport (orgX, orgY, width, height)
        );
    this.mCamera2.setBackgroundColor([0.27, 0.81, 0.83, 1]);    
    // Step B: Read all the squares
    sceneParser.parseSquares(this.mSqSet);

    // now start the bg music ...
    gEngine.AudioClips.playBackgroundAudio(this.kBgClip);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
BlueLevel.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    // Step  B: Activate the drawing Camera
    this.mCamera.setupViewProjection();

    // Step  C: draw all the squares
    var i;
    for (i = 0; i < this.mSqSet.length; i++) {
        this.mSqSet[i].draw(this.mCamera.getVPMatrix());
    }
    
    this.mCamera2.setupViewProjection();
    for(var i = 0; i < this.mSqSet.length; i++) {
        this.mSqSet[i].draw(this.mCamera.getVPMatrix());
    }
};

// The update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
BlueLevel.prototype.update = function () {
    var deltaX = 0.05;

    /// Move right and swap ovre
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {

    }

    // Step A: test for white square movement
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)) {

    }
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Q)) {
        gEngine.GameLoop.stop();
    }
};