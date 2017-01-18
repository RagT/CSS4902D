/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */
/*jslint node: true, vars: true */
/*global gEngine: false, Scene: false, BlueLevel: false, Camera: false, Renderable: false, vec2: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

//Class used to show GrayScene stored in GrayScene.JSON
function MyGame() {
     // audio clips: supports both mp3 and wav formats
    this.kBgClip = "assets/sounds/BGClip.mp3";
    this.kCue = "assets/sounds/MyGame_cue.wav";
    
    // scene file name
    this.kSceneFile = "assets/GrayScene.json";
    
    // The camera to view the scene
    this.mCamera = null;

    //Set of objects in level
    this.mSqSet = [];
}
gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.loadScene = function () {
    //load JSON file
    gEngine.TextFileLoader.loadTextFile(this.kSceneFile, gEngine.TextFileLoader.eTextFileType.eTextFile);
    // loads the audios
    gEngine.AudioClips.loadAudio(this.kBgClip);
    gEngine.AudioClips.loadAudio(this.kCue);
};


MyGame.prototype.unloadScene = function() {
    // Step A: Game loop not running, unload all assets
    // stop the background audio
    gEngine.AudioClips.stopBackgroundAudio();

    // unload the scene resources
    // gEngine.AudioClips.unloadAudio(this.kBgClip);
    //      You know this clip will be used elsewhere in the game
    //      So you decide to not unload this clip!!
    gEngine.AudioClips.unloadAudio(this.kCue);
    
    //Unload JSON file
    gEngine.TextFileLoader.unloadTextFile(this.kSceneFile);
    
    // Step B: starts the next level
    // starts the next level
    var nextLevel = new BlueLevel();  // next level to be loaded
    gEngine.Core.startScene(nextLevel);
};

//MyGame.prototype.draw = function () {
//    // Step A: Game loop not running, unload all assets
//    // stop the background audio
//    gEngine.AudioClips.stopBackgroundAudio();
//
//    // unload the scene resources
//    // gEngine.AudioClips.unloadAudio(this.kBgClip);
//    //      The above line is commented out on purpose because
//    //      you know this clip will be used elsewhere in the game
//    //      So you decide to not unload this clip!!
//    gEngine.AudioClips.unloadAudio(this.kCue);
//
//    // Step B: starts the next level
//    // starts the next level
//    var nextLevel = new BlueLevel();  // next level to be loaded
//    gEngine.Core.startScene(nextLevel);
//};

MyGame.prototype.initialize = function () {
    var sceneParser = new SceneFileParser(this.kSceneFile, "JSON");

    // Step A: Read in the camera
    this.mCamera = sceneParser.parseCamera();

    // Step B: Read all the squares
    sceneParser.parseSquares(this.mSqSet);

    // now start the bg music ...
    gEngine.AudioClips.playBackgroundAudio(this.kBgClip);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    // Step  B: Activate the drawing Camera
    this.mCamera.setupViewProjection();

    // Step  C: draw everything

};

// The update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
    // let's only allow the movement of hero, 
    // and if hero moves too far off, this level ends, we will
    // load the next level
    var deltaX = 0.05;

    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {

    }

    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)) {

    }
};