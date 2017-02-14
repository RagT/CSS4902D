/* 
 * DyePack.js
 *Stores all functionality for the dye pack game object.
 */

/* global GameObject, gEngine, vec2 */

function DyePack(xLoc, yLoc, texture) {
    this.dyePackSprite = new SpriteRenderable(texture);
    
    //Get dyepack image from the sprite sheet
    this.dyePackSprite.setElementPixelPositions(500, 595, 0, 150); 
    
    //Set sprite characteristics
    this.dyePackSprite.getXform().setPosition(xLoc, yLoc);
    this.dyePackSprite.getXform().setSize(2, 3.25);
    this.dyePackSprite.getXform().setRotationInDegree(90);
    this.dyePackSprite.setColor([1,1,1,0]);
    
    //Call superclass constructor
    GameObject.call(this, this.dyePackSprite);
    this.setSpeed(1);
    this.creationTime = Date.now(); //Allows us to determine how long dye pack has been around
    
    //Move in positive x-direction
    this.setCurrentFrontDir(vec2.fromValues(1,0));
}
//This is a subclass of the GameObject Class
gEngine.Core.inheritPrototype(DyePack, GameObject);

DyePack.prototype.draw = function(camera) {
    if(!this.isExpired()){
        this.dyePackSprite.draw(camera);
    }
};

DyePack.prototype.update = function() {
    var pos = this.getXform().getPosition();
    vec2.scaleAndAdd(pos, pos, this.getCurrentFrontDir(), this.getSpeed());
};

DyePack.prototype.isExpired = function() {
    return Date.now() - this.creationTime >= 5000;
};

//Handles behavior when dyepack hits patrol
DyePack.prototype.hit = function() {
    
};