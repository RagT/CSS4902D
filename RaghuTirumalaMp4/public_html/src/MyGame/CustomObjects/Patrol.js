/* 
 *Patrol.js
 *
 *Implement functionality of patrol enemies on map
 */

/* global GameObject, gEngine */

function Patrol(xLoc, yLoc, texture, showBBox) {
    this.headSprite = new SpriteRenderable(texture);
    
    //Get head from sprite sheet
    this.headSprite.setElementPixelPositions(150, 300, 0, 200);
    
    //Set head attributes
    this.headSprite.setColor([1,1,1,0]);
    this.headSprite.getXform().setPosition(xLoc, yLoc);
    this.headSprite.getXform().setSize(7.5, 7.5);
    GameObject.call(this, this.headSprite);
    
    this.bBoxRenderableHead = new BoundingBoxRenderable(this.getBBox());
    
    //the wings
    this.topWing = new PatrolWing(xLoc, yLoc, 10, 6, texture);
    this.bottomWing = new PatrolWing(xLoc, yLoc, 10, -6, texture);
    this.bigBBox = new BoundingBox(0,0,0);
    this.updateSpanningBBox();
    this.bigBBoxRenderable = new BoundingBoxRenderable(this.bigBBox);
    this.showBBox = showBBox;
    this.topWing.setShowBBox(showBBox);
    this.bottomWing.setShowBBox(showBBox);
}
gEngine.Core.inheritPrototype(Patrol, GameObject);

Patrol.prototype.draw = function(camera) {
    this.headSprite.draw(camera);
    this.topWing.draw(camera);
    this.bottomWing.draw(camera);
    if(this.showBBox) {
        this.bBoxRenderableHead.draw(camera);
        this.bigBBoxRenderable.draw(camera);
    }
};

Patrol.prototype.update = function() {
    var pos = this.getXform().getPosition();
    this.topWing.update(pos);
    this.bottomWing.update(pos);
    vec2.scaleAndAdd(pos, pos, this.getCurrentFrontDir(), this.getSpeed());
    this.setRandomSpeedandDirection();
    this.bBoxRenderableHead.updateLines(this.getBBox());
    this.updateSpanningBBox();
    this.bigBBoxRenderable.updateLines(this.bigBBox);
    
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.J)) {
        this.hit();
    }     
};

Patrol.prototype.setRandomSpeedandDirection = function() {
    var minSpeed = 5/60;
    var maxSpeed = 10/60;
    this.setSpeed((Math.random() * (maxSpeed - minSpeed)) + minSpeed);
    this.setCurrentFrontDir(vec2.fromValues(2 * (Math.random() - 0.5), 2 * (Math.random() - 0.5)));
};

Patrol.prototype.isExpired = function() {
    return this.getXform().getXPos() > 200 || this.topWing.getRenderable().getColor()[3] > 1 ||
            this.bottomWing.getRenderable().getColor()[3] > 1;  
};

Patrol.prototype.hit = function() {
    this.getXform().incXPosBy(5);
};

Patrol.prototype.updateSpanningBBox = function() {
    var topMinX = this.topWing.getBBox().minX();
    var topMaxX = this.topWing.getBBox().maxX();
    var topMinY = this.topWing.getBBox().minY();
    var topMaxY = this.topWing.getBBox().maxY();
    
    var bottomMinX = this.bottomWing.getBBox().minX();
    var bottomMaxX = this.bottomWing.getBBox().maxX();
    var bottomMinY = this.bottomWing.getBBox().minY();
    var bottomMaxY = this.bottomWing.getBBox().maxY();
    
    var headMinX = this.getBBox().minX();
    var headMaxX = this.getBBox().maxX();
    var headMinY = this.getBBox().minY();
    var headMaxY = this.getBBox().maxY();
    
    var minX = Math.min(topMinX, Math.min(bottomMinX, headMinX));
    var minY = Math.min(topMinY, Math.min(bottomMinY, headMinY));
    var maxX = Math.max(topMaxX, Math.max(bottomMaxX, headMaxX));
    var maxY = Math.max(topMaxY, Math.max(bottomMaxY, headMaxY));
    
    var width = maxX - minX;
    var height = (maxY - minY) * 1.5;
    var cX = minX + (width/2);
    var cY = minY + (height/2);
    
    this.bigBBox.setBounds([cX,cY], width, height);
};

Patrol.prototype.setShowBBox = function(b) {
    this.showBBox = b;
    this.topWing.setShowBBox(b);
    this.bottomWing.setShowBBox(b);
};

Patrol.prototype.checkForCollisionWithPack = function(bBox) {
    if(this.getBBox().intersectsBound(bBox)){
        this.hit();
        return true;
    } else if(this.topWing.getBBox().intersectsBound(bBox)) {
        this.topWing.hit();
        return true;
    } else if(this.bottomWing.getBBox().intersectsBound(bBox)) {
        this.bottomWing.hit();
        return true;
    }
    return false;
};

Patrol.prototype.checkForCollisionWithDye = function(bBox) {
    return this.getBBox().intersectsBound(bBox);
};