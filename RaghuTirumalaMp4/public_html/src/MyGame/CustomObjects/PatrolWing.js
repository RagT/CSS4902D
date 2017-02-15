/* 
 * PatrolWing.js
 * 
 * Encapsulates functionality for Wing objects in the Patrol
 */

function PatrolWing(xLoc, yLoc, xDist, yDist, texture) {
    this.wingSprite = new SpriteAnimateRenderable(texture);
    
    //Set sprite attributes
    this.wingSprite.setColor([1,1,1,0]);
    this.wingSprite.getXform().setPosition(xLoc + xDist, yLoc + yDist);
    this.wingSprite.getXform().setSize(10, 8);
    
    //Set animation
    this.wingSprite.setSpriteSequence(512, 0,
                                           204, 164,
                                           5,
                                           0);
    this.wingSprite.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
    this.wingSprite.setAnimationSpeed(10);
    
    GameObject.call(this, this.wingSprite);
    
    this.intX = new Interpolate(xLoc + xDist, 120, 0.05);
    this.intY = new Interpolate(yLoc + yDist, 120, 0.05);
    this.xDist = xDist;
    this.yDist = yDist;
    this.bBoxRenderable = new BoundingBoxRenderable(this.getBBox());
    this.showBBox = false;
}
gEngine.Core.inheritPrototype(PatrolWing, GameObject);

PatrolWing.prototype.draw = function(camera) {
    this.wingSprite.draw(camera);
    if(this.showBBox) {
        this.bBoxRenderable.draw(camera);
    }
};

PatrolWing.prototype.update = function(pos) {
    //update animation and interpolation
    this.wingSprite.updateAnimation();
    this.intX.updateInterpolation();
    this.intY.updateInterpolation();
    
    //move wing
    this.intX.setFinalValue(pos[0] + this.xDist);
    this.intY.setFinalValue(pos[1] + this.yDist);
    this.wingSprite.getXform().setPosition(this.intX.getValue(), this.intY.getValue());
    
    //update bounding box
    this.bBoxRenderable.updateLines(this.getBBox());
};

PatrolWing.prototype.hit = function(){
    var color = this.wingSprite.getColor();
    color[3] = color[3] + 0.2;
    this.wingSprite.setColor(color);
};

PatrolWing.prototype.setShowBBox = function(b) {
    this.showBBox = b;
};