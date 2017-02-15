/* 
 * Dye.js
 * 
 * Class containing functionality for the Dye character.
 */

function Dye(xLoc, yLoc, texture) {
    this.dyeSprite = new SpriteRenderable(texture);
    
    //Get dye image from sprite sheet
    this.dyeSprite.setElementPixelPositions(0, 120, 0, 180);
    
    //Set Dye sprite's attributes
    this.dyeSprite.setColor([1,1,1,0]);
    this.dyeSprite.getXform().setPosition(xLoc, yLoc);
    this.dyeSprite.getXform().setSize(9, 12);
    
    this.intX = new Interpolate(35, 120, 0.05);
    this.intY = new Interpolate(35, 120, 0.05);
    
    //shake behavior
    this.shake = new ShakePosition(4.5, 6, 4, 60);
    this.isHit = false;
    
    //Call superclass constructor
    GameObject.call(this, this.dyeSprite);
}
//Subclass of GameObject
gEngine.Core.inheritPrototype(Dye, GameObject);

Dye.prototype.draw = function(camera) {
    this.dyeSprite.draw(camera);
};

Dye.prototype.update = function(camera) {
    this.intX.updateInterpolation();
    this.intY.updateInterpolation();
    if(this.isHit) {
        if(!this.shake.shakeDone()) {
            var nextPos = this.shake.getShakeResults();
            this.getXform().setSize(9 - nextPos[0], 12 - nextPos[1]);
        } else {
            this.isHit = false;
        }
    }
    
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.Q)) {
        this.isHit = true;
        this.shake.setDuration(60);
    }
    if(camera.isMouseInViewport()) {
        this.intX.setFinalValue(camera.mouseWCX());
        this.intY.setFinalValue(camera.mouseWCY());
    }
    this.getXform().setXPos(this.intX.getValue());
    this.getXform().setYPos(this.intY.getValue());
};

