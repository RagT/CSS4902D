/* 
 * Class for circle game objects
 */

/* global RigidObject, gEngine, SpriteAnimateRenderable */

var Circle = function(spriteTexture, xLoc, yLoc) {
    var radius = gEngine.Core.getRandomInRange(3.8, 5.8);
    this.renderable = new SpriteAnimateRenderable(spriteTexture);
    this.renderable.setColor([1, 1, 1, 0]);
    this.renderable.getXform().setPosition(xLoc, yLoc);
    this.renderable.getXform().setSize(radius * 1.5, radius * 1.5);
    this.renderable.setSpriteSequence(512, 0,      // first element pixel position: top-left 512 is top of image, 0 is left of image
                                    204, 164,   // widthxheight in pixels
                                    5,          // number of elements in this sequence
                                    0);         // horizontal padding in between
    this.renderable.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
    this.renderable.setAnimationSpeed(30);
                                // show each element for mAnimSpeed updates

    RigidObject.call(this, this.renderable);
    
    
    var r = new RigidCircle(this.getXform(), radius);
    this.setRigidBody(r);
    this.toggleDrawRenderable();
};
gEngine.Core.inheritPrototype(Circle, RigidObject);

Circle.prototype.update = function() {
    RigidObject.prototype.update.call(this);
    this.renderable.updateAnimation();
};