/* 
 * DyePack.js
 *Stores all functionality for the dye pack game object.
 */

/* global GameObject, gEngine */

function DyePack(xLoc, yLoc, texture) {
    this.dyePackSprite = new SpriteRenderable(texture);
    this.framesRemaining = 300; //Supposed to last 300 frames
    
    //Get dyepack image from the sprite sheet
    this.dyePackSprite.setElementPixelPositions(500, 595, 0, 150); 
    this.dyePackSprite.getXform().setPosition(xLoc, yLoc);
    this.dyePackSprite.getXform().setSize(2, 3.25);
    this.dyePackSprite.getXform().setRotationInDegree(90);
    this.dyePackSprite.setColor([1,1,1,0]);
    GameObject.call(this, this.dyePackSprite);
}
//This is a subclass of the GameObject Class
gEngine.Core.inheritPrototype(DyePack, GameObject);

DyePack.prototype.draw = function(camera) {
    if(!this.isExpired()){
        this.dyePackSprite.draw(camera);
    }
};

DyePack.prototype.update = function() {
    this.framesRemaining--;
};

DyePack.prototype.isExpired = function() {
    return this.framesRemaining <= 0;
};