/* 
 * Hero.js
 * 
 * Contains functionality for hero game object
 */

/* global GameObject */

function Hero(texture) {
    this.heroRenderable = new SpriteRenderable(texture);
    this.heroRenderable.setElementPixelPositions(0, 120, 0, 180);
    this.heroRenderable.getXform().setPosition(50, 37.5);
    this.heroRenderable.getXform().setSize(9,12);
    
    this.heroRec = new Rectangle(this.heroRenderable.getXform().getPosition(), 
    this.heroRenderable.getXform().getWidth(), this.heroRenderable.getXform().getHeight());
    GameObject.call(this, this.heroRenderable, this.heroRec);
    
    this.showBounds = false;
    
    //Make sure hero has no velocity
    this.setSpeed(0);
}
gEngine.Core.inheritPrototype(Hero, GameObject);

Hero.prototype.draw = function(camera) {
    this.getRenderable().draw(camera);
    this.getPhysicsComponent().draw(camera);
};

Hero.prototype.update = function() {
    var delta = 0.2;
    
    //Movement
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.W)) {
        this.getXform().incYPosBy(delta);
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.A)) {
        this.getXform().incXPosBy(-delta);
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.S)) {
        this.getXform().incYPosBy(-delta);
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
        this.getXform().incXPosBy(delta);
    }
    this.getPhysicsComponent().updatePos(this.getXform().getPosition());
    
    //Rotation
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.Z)) {
        
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.X)) {
        
    }
    
    //Toggle showing bounds
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.T)) {
        this.showBounds = !this.showBounds;
    }
};