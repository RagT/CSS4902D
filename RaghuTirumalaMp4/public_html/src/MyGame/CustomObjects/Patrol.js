/* 
 *Patrol.js
 *
 *Implement functionality of patrol enemies on map
 */

/* global GameObject, gEngine */

function Patrol(xLoc, yLoc, texture) {
    this.headSprite = new SpriteRenderable(texture);
    
    //Get head from sprite sheet
    this.headSprite.setElementPixelPositions(150, 300, 0, 200);
    
    //Set head attributes
    this.headSprite.setColor([1,1,1,0]);
    this.headSprite.getXform().setPosition(xLoc, yLoc);
    this.headSprite.getXform().setSize(7.5, 7.5);
    
    GameObject.call(this, this.headSprite);
    
    //the wings
    this.topWing = new PatrolWing(xLoc, yLoc, 10, 6, texture);
    this.bottomWing = new PatrolWing(xLoc, yLoc, 10, -6, texture);
}
gEngine.Core.inheritPrototype(Patrol, GameObject);

Patrol.prototype.draw = function(camera) {
    this.headSprite.draw(camera);
    this.topWing.draw(camera);
    this.bottomWing.draw(camera);
};

Patrol.prototype.update = function() {
    var pos = this.getXform().getPosition();
    this.topWing.update(pos);
    this.bottomWing.update(pos);
    vec2.scaleAndAdd(pos, pos, this.getCurrentFrontDir(), this.getSpeed());
    this.setRandomSpeedandDirection();
    
};

Patrol.prototype.setRandomSpeedandDirection = function() {
    var minSpeed = 5/60;
    var maxSpeed = 10/60;
    this.setSpeed((Math.random() * (maxSpeed - minSpeed)) + minSpeed);
    this.setCurrentFrontDir(vec2.fromValues(2 * (Math.random() - 0.5), 2 * (Math.random() - 0.5)));
};

Patrol.prototype.isExpired = function() {
    return this.getXform().getXPos() > 200;  
};