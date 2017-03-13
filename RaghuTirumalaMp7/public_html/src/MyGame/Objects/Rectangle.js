/* 
 * Class for Rectangle game objects
 */

/* global gEngine, RigidObject, GameObject */

var Rectangle = function(spriteTexture, xLoc, yLoc, isWall, width, height) {
    this.renderable = new SpriteRenderable(spriteTexture);
    this.renderable.setColor([1, 1, 1, 0]);
    this.renderable.getXform().setPosition(xLoc, yLoc);
    if(!isWall) {
        width = gEngine.Core.getRandomInRange(3, 8);
        height = gEngine.Core.getRandomInRange(2.4, 7.4);
        this.renderable.getXform().setSize(width, height);
        this.renderable.setElementPixelPositions(0, 120, 0, 180);
    } else {
        this.renderable.getXform().setSize(width, height);
    }
    RigidObject.call(this, this.renderable);
    
    var r = new RigidRectangle(this.getXform(), width, height);
    this.setRigidBody(r);
    this.toggleDrawRenderable();
};
gEngine.Core.inheritPrototype(Rectangle, RigidObject);

Rectangle.prototype.update = function() {
    RigidObject.prototype.update.call(this);
};