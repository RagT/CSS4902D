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
    
    this.mMsg = null;
    
    //Game Object Set with Hero as first element and enemies as rest
    this.mObjects = null;
    
    //Number of enemies in set
    this.numEnemies = 5;
    
    //Selected object number
    this.currentObj = 0;
    
    this.kMinionSprite = "assets/minion_sprite.png";
}
gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(50, 37.5), // position of the camera
        100,                       // width of camera
        [0, 0, 800, 600]           // viewport (orgX, orgY, width, height)
    );
    
    this.mObjects = new GameObjectSet();
    this.mObjects.addToSet(new Hero(this.kMinionSprite));
    
    var startingX = 10;
    var startingY = 50;
    
    //Initialize enemies
    for(var i = 0; i < this.numEnemies; i++) {
        var xLoc = startingX + 20 * i;
        var yLoc = startingY;
        this.mObjects.addToSet(new Enemy(this.kMinionSprite, xLoc, yLoc));
    }
    
    this.mMsg = new FontRenderable("Num: " + (this.numEnemies + 1) + " Current=" + 
    this.currentObj + " R=" + this.mObjects.getObjectAt(this.currentObj).getRadius());
    this.mMsg.setColor([0, 0, 0, 1]);
    this.mMsg.getXform().setPosition(3, 4);
    this.mMsg.setTextHeight(3);
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
    this.mObjects.draw(this.mCamera);
    this.mMsg.draw(this.mCamera);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
    //Handle collisions for all game objects
    gEngine.Physics.collision();
    this.mObjects.update();
    this.updateStatus();
    
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.Left)) {
        if(this.currentObj > 0) {
            this.currentObj--;
        }
    }
    
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.Right)) {
        if(this.currentObj < this.numEnemies) {
            this.currentObj++;
        }
    }
};

MyGame.prototype.updateStatus = function() {
    this.mMsg.setText("Num: " + (this.numEnemies + 1) + " Current=" + 
    this.currentObj + " R=" + this.mObjects.getObjectAt(this.currentObj).getRadius());
};