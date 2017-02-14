/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame() {
    // The camera to view the scene
    this.mCamera = null;
    this.mDyePacks = null;
    this.kMinionSprite = "assets/minion_sprite.png";
}
gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(100, 75), // position of the camera
        200,                       // width of camera
        [0, 0, 800, 600]           // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray
    this.mDye = new Dye(100, 75, this.kMinionSprite);
    this.mDyePacks = new GameObjectSet();
};

MyGame.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kMinionSprite);
};

MyGame.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kMinionSprite);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    this.mDye.draw(this.mCamera);
    this.mDyePacks.draw(this.mCamera);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
    this.mDye.update(this.mCamera);
    this.mDyePacks.update();
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)) {
        this.mDyePacks.addToSet(new DyePack(this.mDye.getXform().getXPos(),
        this.mDye.getXform().getYPos(), this.kMinionSprite));
    }    
};