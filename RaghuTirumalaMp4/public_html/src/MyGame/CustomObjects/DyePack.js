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
    
    //shake behavior
    this.shake = new ShakePosition(4, 0.2, 20, 300);
    this.isHit = false;
    
    //Call superclass constructor
    GameObject.call(this, this.dyePackSprite);
    this.setSpeed(2);
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
    if(!this.isHit) {
        var pos = this.getXform().getPosition();
        vec2.scaleAndAdd(pos, pos, this.getCurrentFrontDir(), this.getSpeed());
    } else {
        if(!this.shake.shakeDone()) {
            var currentPos = this.getXform().getPosition();
            var nextPos = this.shake.getShakeResults();
            this.getXform().setPosition(currentPos[0] + nextPos[0], currentPos[1] + nextPos[1]);
        }
    }
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.S)) {
        this.isHit = true;
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.D)){
        this.incSpeedBy(-0.05);
    }
};

DyePack.prototype.isExpired = function() {
    var time = Date.now() - this.creationTime;
    return !this.isInBounds(0, 200, 0, 150) || time >= 5000 || 
            (this.isHit && this.shake.shakeDone()) || this.getSpeed() <= 0; 
};