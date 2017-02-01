/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine: false, Scene: false, SpriteRenderable: false, Camera: false, vec2: false,
  TextureRenderable: false, Renderable: false, SpriteAnimateRenderable: false, GameOver: false,
  FontRenderable: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame() {
    // textures: 
    this.kFontImage = "assets/Consolas-72.png";
    this.kMinionSprite = "assets/minion_sprite.png";
    this.kBoundImage = "assets/Bound.png";
    
    // The camera to view the scene
    this.mCamera = null;
    
    // Sprite source and Interactive bound
    this.mSpriteSource = null;
    this.mInteractiveBound = null;
    
    //ZoomedViews
    this.mZoomedViews = null;
    
    //AnimationView
    this.mAnimationView = null;
    
    this.mTextSysFont = null;
}
gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.loadScene = function () {
    //load the textures    
    gEngine.Textures.loadTexture(this.kFontImage);
    gEngine.Textures.loadTexture(this.kMinionSprite);
    gEngine.Textures.loadTexture(this.kBoundImage);
};

MyGame.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kFontImage);
    gEngine.Textures.unloadTexture(this.kMinionSprite);
    gEngine.Textures.unloadTexture(this.kBoundImage);
};

MyGame.prototype.initialize = function () {
    var spriteSourceImage = $('#Dropdown').val();
    
    //Create SpriteSource Renderable
    this.mSpriteSource = new SpriteSource(spriteSourceImage, 50, 50);
    //Create InteractiveBound renderable
    this.mInteractiveBound = new InteractiveBound(this.kBoundImage, 50, 50,
    this.mSpriteSource.getBounds(), false);
    //Create Zoomed Views
    this.mZoomedViews = new ZoomedViews(this.mInteractiveBound);
    
    //Init animation view
    this.mAnimationView = new AnimationView(this.mInteractiveBound, this.mSpriteSource);
    
    //Aspect ratio of sprite source image
    var aspectRatio = this.mSpriteSource.getAspectRatio();
    
    //Set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(50, 50),   // position of the camera
        150 * aspectRatio + 40,                       // width of camera
        [160, 0, 480, 480]           // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray
    var boundPos = this.mInteractiveBound.getPosition(); 
    var boundSize = this.mInteractiveBound.getSize();
    this.mTextSysFont = new FontRenderable("Status:Bound Pos=(" + 
            boundPos[0].toPrecision(4) + " " + boundPos[1].toPrecision(4) +") Size=(" 
            + boundSize[0].toPrecision(4) + " " + boundSize[1].toPrecision(4) +")");
    var camWidth = 150 * aspectRatio + 40;
    var textH = 5 * aspectRatio;
    this._initText(this.mTextSysFont, 50 - camWidth/2 + 10, 50 - camWidth/2 + 10, [0, 0, 0, 1], textH);
};

MyGame.prototype._initText = function (font, posX, posY, color, textH) {
    font.setColor(color);
    font.getXform().setPosition(posX, posY);
    font.setTextHeight(textH);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    // Step  B: Activate the drawing Camera
    this.mCamera.setupViewProjection();
    
    
    // Step  C: Draw everything
    this.mSpriteSource.draw(this.mCamera);
    this.mInteractiveBound.draw(this.mCamera);
    
    // drawing the text output
    this.mTextSysFont.draw(this.mCamera.getVPMatrix());
    var cameras = this.mZoomedViews.getCameras();
    
    //Draw on Zoomed Views
    for(var i = 0; i < cameras.length; i++) {
        cameras[i].setupViewProjection();
        this.mSpriteSource.draw(cameras[i]);
        this.mInteractiveBound.draw(cameras[i]);
    }
    this.mAnimationView.draw();
    
};

// The 
//  function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
    var keyPressed = false;
    
    //Update bound text position
    var boundPos = this.mInteractiveBound.getPosition(); 
    var boundSize = this.mInteractiveBound.getSize();
    this.mTextSysFont.setText("Status:Bound Pos=(" + 
            boundPos[0].toPrecision(4) + " " + boundPos[1].toPrecision(4) +") Size=(" 
            + boundSize[0].toPrecision(4) + " " + boundSize[1].toPrecision(4) +")");
    
    var delta = 2;
    
    this.mZoomedViews.updateCameraPos();
    this.mAnimationView.update();
    
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.W)){
        if(gEngine.Input.isKeyPressed(gEngine.Input.keys.Space)){
            this.mInteractiveBound.incYPos(delta / 100);
        } else {
            this.mInteractiveBound.incYPos(delta);
        }
        this.mAnimationView.updatePosition();
        keyPressed = true;
    }
    
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.A)){
        if(gEngine.Input.isKeyPressed(gEngine.Input.keys.Space)){
            this.mInteractiveBound.incXPos(-delta / 100);
        } else {
            this.mInteractiveBound.incXPos(-delta);
        }
        keyPressed = true;
    }
    
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.S)){
        if(gEngine.Input.isKeyPressed(gEngine.Input.keys.Space)){
            this.mInteractiveBound.incYPos(-delta / 100);
        } else {
            this.mInteractiveBound.incYPos(-delta);
        }
        keyPressed = true;
    }
    
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.D)){
        if(gEngine.Input.isKeyPressed(gEngine.Input.keys.Space)){
            this.mInteractiveBound.incXPos(delta / 100);
        } else {
            this.mInteractiveBound.incXPos(delta);
        }
        keyPressed = true;
    }
    
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.Up)){
        if(gEngine.Input.isKeyPressed(gEngine.Input.keys.Space)){
            this.mInteractiveBound.incHeight(delta / 100);
        } else {
            this.mInteractiveBound.incHeight(delta);
        }
        keyPressed = true;
    }
    
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)){
        if(gEngine.Input.isKeyPressed(gEngine.Input.keys.Space)){
            this.mInteractiveBound.incWidth(-delta / 100);
        } else {
            this.mInteractiveBound.incWidth(-delta);
        }
        keyPressed = true;
    }
    
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)){
        if(gEngine.Input.isKeyPressed(gEngine.Input.keys.Space)){
            this.mInteractiveBound.incWidth(delta / 100);
        } else {
            this.mInteractiveBound.incWidth(delta);
        }
        keyPressed = true;
    }
    
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.Down)){
        if(gEngine.Input.isKeyPressed(gEngine.Input.keys.Space)){
            this.mInteractiveBound.incHeight(-delta / 100);
        } else {
            this.mInteractiveBound.incHeight(-delta);
        }
        keyPressed = true;
    }
    
    if((gEngine.Input.isKeyReleased(gEngine.Input.keys.W)
    || gEngine.Input.isKeyReleased(gEngine.Input.keys.A)
    || gEngine.Input.isKeyReleased(gEngine.Input.keys.S)
    || gEngine.Input.isKeyReleased(gEngine.Input.keys.D)
    || gEngine.Input.isKeyReleased(gEngine.Input.keys.Up)
    || gEngine.Input.isKeyReleased(gEngine.Input.keys.Down)
    || gEngine.Input.isKeyReleased(gEngine.Input.keys.Left)
    || gEngine.Input.isKeyReleased(gEngine.Input.keys.Right))
    && !keyPressed) {
        this.mAnimationView.updatePosition();
    }
    
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.Q)) {
        this.mInteractiveBound.togglePreview();
    } 
};