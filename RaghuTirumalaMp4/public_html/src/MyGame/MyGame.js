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
    this.mPatrols = null;
    this.mTextSysFont = null;
    this.bg = "assets/background.png";
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
    
//    //Array of the 4 upper cameras
    this.topCams = [];
    this.topCamsActive = [false, false, false, false];
    this.topCamsForceActive = [false, false, false, false];
    
    var camWidth = 200;
    var camHeight =  200;
    
    for(var i = 0; i < 4; i++) {
        var wcWidth = 6;
        if(i === 0) {
            wcWidth = 15;
        }
        var camera = new Camera(
        vec2.fromValues(100, 75), // position of the camera
        wcWidth,                       // width of camera
        [0 + 200 * i, 600, camWidth, camHeight]           // viewport (orgX, orgY, width, height)
        );
        camera.configInterpolation(0.8, 10);
        camera.setBackgroundColor([0.8,0.8,0.8,1]);
        this.topCams.push(camera);
    }
    
    this.background = new SpriteRenderable(this.bg);
    this.background.getXform().setPosition(100,75);
    this.background.getXform().setSize(200,150);
    this.background.setElementPixelPositions(0,2048,0,1536);
           
    this.mDye = new Dye(100, 75, this.kMinionSprite);
    this.mDyePacks = new GameObjectSet();
    this.mPatrols = new GameObjectSet();
    this.mTextSysFont = new FontRenderable("DyePacks:" + this.mDyePacks.size() + 
            " Patrols:" + this.mPatrols.size() + " AutoSpawn:Off");
    this.autoSpawn = false;
    this.spawnTimer = Date.now();
    this.nextSpawnTime = (Math.random() + 2) * 1000;
    this._initText(this.mTextSysFont, 10, 5, [1,1,1,1], 5);
    this.showPatrolBBox = false;
};

MyGame.prototype.drawOnCam = function(camera) {
    camera.setupViewProjection();
    this.background.draw(camera);
    this.mDye.draw(camera);
    this.mDyePacks.draw(camera);
    this.mPatrols.draw(camera);
};

MyGame.prototype._initText = function (font, posX, posY, color, textH) {
    font.setColor(color);
    font.getXform().setPosition(posX, posY);
    font.setTextHeight(textH);
};

MyGame.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kMinionSprite);
    gEngine.Textures.loadTexture(this.bg);
};

MyGame.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kMinionSprite);
    gEngine.Textures.unloadTexture(this.bg);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    this.background.draw(this.mCamera);
    this.mDye.draw(this.mCamera);
    this.mDyePacks.draw(this.mCamera);
    this.mPatrols.draw(this.mCamera);
    this.mTextSysFont.draw(this.mCamera);
    for(var i = 0; i < this.topCams.length; i++) {
        if(this.topCamsActive[i] || this.topCamsForceActive[i]) {
            this.drawOnCam(this.topCams[i]);
        }
    }
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
    this.mDye.update(this.mCamera);
    this.topCams[0].panTo(this.mDye.getXform().getXPos(), this.mDye.getXform().getYPos());
    this.mDyePacks.update();
    this.mPatrols.update();
    this.updateTopCams();
    var spawnState = "";
    if(this.autoSpawn) {
        spawnState = "On";
    } else {
        spawnState = "Off";
    }
    this.mTextSysFont.setText("DyePacks:" + this.mDyePacks.size() + 
            " Patrols:" + this.mPatrols.size() + " AutoSpawn:" + spawnState);
      
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)) {
        this.mDyePacks.addToSet(new DyePack(this.mDye.getXform().getXPos(),
        this.mDye.getXform().getYPos(), this.kMinionSprite));
    }    
    
    //Spawn a new patrol
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.C)) {
        var pos = this.getRandomPosInBounds(100, 200, 75, 150);
        this.mPatrols.addToSet(new Patrol(pos[0], pos[1], this.kMinionSprite, 
        this.showPatrolBBox));
    }
    
    //toggle autospawn
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.P)) {
        this.autoSpawn = !this.autoSpawn;
    }
    
    //toggle showing patrol bBox
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.B)) {
        this.showPatrolBBox = !this.showPatrolBBox;
        for(var i = 0; i < this.mPatrols.size(); i++) {
            this.mPatrols.getObjectAt(i).setShowBBox(this.showPatrolBBox);
        }
    }
    
    //Toggle zoom views
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.Zero)) {
        this.topCamsForceActive[0] = !this.topCamsForceActive[0];
    }
    
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.One)) {
        this.topCamsForceActive[1] = !this.topCamsForceActive[1];
    }
    
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.Two)) {
        this.topCamsForceActive[2] = !this.topCamsForceActive[2];
    }
    
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.Three)) {
        this.topCamsForceActive[3] = !this.topCamsForceActive[3];
    }
    
    if(this.autoSpawn) {
        if(Date.now() - this.spawnTimer >= this.nextSpawnTime){
            var pos = this.getRandomPosInBounds(100, 200, 75, 150);
            this.mPatrols.addToSet(new Patrol(pos[0], pos[1], this.kMinionSprite,
            this.showPatrolBBox));
            this.nextSpawnTime = (Math.random() + 2) * 1000;
            this.spawnTimer = Date.now();
        }
    }
    
    this.handleCollisions();
};

MyGame.prototype.updateTopCams = function() {
    this.topCams[0].update();

    if(this.mDyePacks.size() >= 1) {
        this.topCamsActive[1] = true;
        if(this.mDyePacks.size() >=2) {
            this.topCamsActive[2] = true;
            if(this.mDyePacks.size() >= 3) {
                this.topCamsActive[3] = true;
            } else {
                this.topCamsActive[3] = false;
            }
        } else {
            this.topCamsActive[2] = false;
        }
    } else {
        this.topCamsActive[1] = false;
    }
    
    var max = Math.min(this.mDyePacks.size(), 3);
    for(var i = 0; i < max; i++) {
        var dyePack = this.mDyePacks.getObjectAt(i);
        this.topCams[i+1].setWCCenter(dyePack.getXform().getXPos(), 
                                       dyePack.getXform().getYPos());
        this.topCams[i+1].update();
    }
};

MyGame.prototype.handleCollisions = function() {
    var i;
    for(i = 0; i < this.mDyePacks.size(); i++) {
        var dyePackBBox = this.mDyePacks.getObjectAt(i).getBBox();
        for(var j = 0; j < this.mPatrols.size(); j++) {
            if(this.mPatrols.getObjectAt(j).checkForCollisionWithPack(dyePackBBox)) {
                this.mDyePacks.getObjectAt(i).hit();
            }
        }
    }
    for(var j = 0; j < this.mPatrols.size(); j++) {
        if(this.mPatrols.getObjectAt(j).checkForCollisionWithDye(this.mDye.getBBox())){
            this.mDye.hit();
        }
    }
};

MyGame.prototype.getRandomPosInBounds = function(xMin, xMax, yMin, yMax) {
  var pos = [];
  pos.push(Math.floor((Math.random() * (xMax - xMin)) + xMin));
  pos.push(Math.floor((Math.random() * (yMax - yMin)) + yMin));
  return pos;
};