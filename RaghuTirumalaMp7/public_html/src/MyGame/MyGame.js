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
    this.kMinionSprite = "assets/minion_sprite.png";
    this.kWallSprite = "assets/Dark_brown.png";
    this.kPlatformSprite = "assets/platform.png";
    
    // The camera to view the scene
    this.mCamera = null;

    this.mMsg = null;
    this.drawRenderables = false;
    this.mAllObjs = null;
    this.mCollisionInfos = [];
    
    this.mCurrentObj = 0;
}
gEngine.Core.inheritPrototype(MyGame, Scene);


MyGame.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kMinionSprite);
    gEngine.Textures.loadTexture(this.kWallSprite);
    gEngine.Textures.loadTexture(this.kPlatformSprite);
};

MyGame.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kMinionSprite);
    gEngine.Textures.unloadTexture(this.kWallSprite);
    gEngine.Textures.unloadTexture(this.kPlatformSprite);
};

MyGame.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(50, 37.5), // position of the camera
        100,                     // width of camera
        [0, 0, 800, 600]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray
    
    this.mAllObjs = new GameObjectSet();
    
    //Add walls
    var bottomWall = new Rectangle(this.kWallSprite, 50, 1.5, true, 94, 3);
    var topWall = new Rectangle(this.kWallSprite, 50, 73.5, true, 94, 3);
    var leftWall = new Rectangle(this.kWallSprite, 1.5, 37.5, true, 3, 94);
    var rightWall = new Rectangle(this.kWallSprite, 98.5, 37.5, true, 3, 94);
    
    bottomWall.getRigidBody().setInvMass(0);
    topWall.getRigidBody().setInvMass(0);
    leftWall.getRigidBody().setInvMass(0);
    rightWall.getRigidBody().setInvMass(0);
    
    this.mAllObjs.addToSet(bottomWall);
    this.mAllObjs.addToSet(topWall);
    this.mAllObjs.addToSet(leftWall);
    this.mAllObjs.addToSet(rightWall);
    
    //Add the platforms
    var platformPos = [[40,40], [60,30], [20,20], [70,50]];
    var platformAngles = [-Math.PI / 6, 0, 0, 0];
    for(var i = 0; i < platformPos.length; i++) {
        var platform = new Rectangle(this.kPlatformSprite, 
        platformPos[i][0], platformPos[i][1], true, 20, 3.75);
        platform.getRigidBody().rotate(platformAngles[i]);
        platform.getRigidBody().setInvMass(0);
        this.mAllObjs.addToSet(platform);
    }

    this.mMsg = new FontRenderable("Status Message");
    this.mMsg.setColor([0, 0, 0, 1]);
    this.mMsg.getXform().setPosition(2, 5);
    this.mMsg.setTextHeight(3);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    
    this.mAllObjs.draw(this.mCamera);
    
    // for now draw these ...
    for (var i = 0; i<this.mCollisionInfos.length; i++) 
        //this.mCollisionInfos[i].draw(this.mCamera);
    this.mCollisionInfos = [];
    
    this.mMsg.draw(this.mCamera);   // only draw status in the main camera
};

MyGame.prototype.increasShapeSize = function(obj, delta) {
    var s = obj.getRigidBody();
    var r = s.incShapeSizeBy(delta);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.kBoundDelta = 0.1;
MyGame.prototype.update = function () {      
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Right)) {

    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Left)) {

    }
    var obj = this.mAllObjs.getObjectAt(this.mCurrentObj);
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Up)) {
;
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.T)) {
        this.drawRenderables = !this.drawRenderables;
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.F)) {
        //Create circle
        var circle = new Circle(this.kMinionSprite, 15, 60);
        this.mAllObjs.addToSet(circle);
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.G)) {
        //Create rectangle
        var rectangle = new Rectangle(this.kMinionSprite, 15, 60, false);
        this.mAllObjs.addToSet(rectangle);
    }
    for(var i = 0; i < this.mAllObjs.size(); i++) {
        this.mAllObjs.getObjectAt(i).setDrawRenderable(this.drawRenderables);
    }
    this.mAllObjs.update(this.mCamera);
    
    gEngine.Physics.processCollision(this.mAllObjs, this.mCollisionInfos);
};