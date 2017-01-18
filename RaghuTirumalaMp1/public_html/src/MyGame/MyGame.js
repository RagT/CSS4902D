/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */
/*jslint node: true, vars: true */
/*global gEngine: false, SimpleShader: false, Renderable: false, Camera: false, mat4: false, vec3: false, vec2: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!


function MyGame(htmlCanvasID) {
    // variables of the constant color shader
    this.mConstColorShader = null;

    // Red Square
    this.mRedSq = null;

    // The camera to view the scene
    this.mCamera = null;
    
    // Initialize the webGL Context
    gEngine.Core.initializeEngineCore(htmlCanvasID);
    
    //Initialize createdSquares array
    this.createdSquares = [];
    
    //delete mode flag
    this.deleteMode = false;
    
    //first square created flag
    this.isFirstCreated = true;
    
    //timer from when first square was created (in ms)
    this.creationTimer = 0;
    
    //timer from when deletion mode starts
    this.deletionTimer = 0;
    
    //index of next square to delete
    this.deletionIndex = 0;
    
    // Initialize the game
    this.initialize();
}

MyGame.prototype.initialize = function () {
    // Step A: set up the cameras
    //get canvas's width and height
    var canvasWidth = document.getElementById("GLCanvas").width;
    var canvasHeight = document.getElementById("GLCanvas").height;
    var worldWidth = 100;
    var worldHeight = 75;
    this.mCamera = new Camera(
        vec2.fromValues(worldWidth / 2, worldHeight / 2),   // position of the camera
        worldWidth,                        // width of camera
        [0, 0, canvasWidth, canvasHeight]         // viewport (orgX, orgY, width, height)
        );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
        // sets the background to gray

    // Step  B: create the shader
    this.mConstColorShader = new SimpleShader(
        "src/GLSLShaders/SimpleVS.glsl",      // Path to the VertexShader 
        "src/GLSLShaders/SimpleFS.glsl");    // Path to the Simple FragmentShader    

    // Step  C: Create the cursor
    this.mRedSq = new Renderable(this.mConstColorShader);
    this.mRedSq.setColor([1, 0, 0, 1]);


    // Step  E: Initialize the red Renderable object: centered 2x2
    this.mRedSq.getXform().setPosition(worldWidth / 2, worldHeight / 2);
    this.mRedSq.getXform().setSize(1, 1);
    
    
    // Step F: Start the game loop running
    gEngine.GameLoop.start(this);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    // Step  B: Activate the drawing Camera
    this.mCamera.setupViewProjection();

    // Draw randomnly generated createdSquares
    for(var i = 0; i < this.createdSquares.length; i++) {
        this.createdSquares[i].draw(this.mCamera.getVPMatrix());
    }
    
    // Step  D: Activate the red shader to draw
    this.mRedSq.draw(this.mCamera.getVPMatrix());
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
    var delta = 0.4;
    var redXform = this.mRedSq.getXform();
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {
        if(redXform.getXPos() < 100){
            redXform.incXPosBy(delta);
        }
    }
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)) {
        if(redXform.getXPos() > 0){
            redXform.incXPosBy(-delta);
        }
    }
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Up)) {
        if(redXform.getYPos() < 75){
            redXform.incYPosBy(delta);
        }
    }
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Down)) {
        if(redXform.getYPos() > 0){
            redXform.incYPosBy(-delta);
        }
    }
    
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)) {
        //Random number of created squares (between 10 and 20)
        var numCreatedSquares = Math.floor((Math.random() * 20) + 10);
        for(var i = 0; i < numCreatedSquares; i++) {    
           this.addSquare(this.mRedSq.getXform());
        }
    }
    
    //Enables deletion mode if squares have been added
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.D) && !this.isFirstCreated){
        this.deleteMode = true;
        this.deletionTimer = Date.now();
    }
    
    if(this.deleteMode){
        this.deleteSquares();
    }
};

//Adds a new random square to createdSquares takes redSquares x form as parameter
MyGame.prototype.addSquare = function(redXform)
{
    var square = new Renderable(this.mConstColorShader);
    
    // Random color
    square.setColor([Math.random(), Math.random(), Math.random(), 1]);

    // x and y displacements from cursor
    var xDist = 5 * (Math.random() - 0.5);
    var yDist = 5 * (Math.random() - 0.5); 

    // Set position for square renderable
    square.getXform().setPosition((redXform.getXPos() + xDist), 
                                (redXform.getYPos() + yDist));

    // Set a random size for the square
    var size = (5 * Math.random()) + 1;
    square.getXform().setSize(size, size);

    // Random rotation
    square.getXform().setRotationInRad(Math.random() * 2);
    
    //Update creationTime field
    if(this.isFirstCreated) {
        this.isFirstCreated = false;
        this.creationTimer = Date.now();
    } else {
        square.setCreationTime(Date.now() - this.creationTimer);
    }
    
    // Add newly created square to array
    this.createdSquares.push(square);
};

MyGame.prototype.deleteSquares = function() {
    while(this.deletionIndex < this.createdSquares.length){
        if(this.createdSquares[this.deletionIndex].getCreationTime() <=
               (Date.now() - this.deletionTimer)){
           this.createdSquares.splice(this.deletionIndex, 1);
        } else {
            break;
        }
    }
    //If everything is deleted, turn delete mode off
    if(this.createdSquares.length === 0) {
        this.isFirstCreated = true;
        this.deleteMode = false;
        this.deletionIndex = 0;
    }
};