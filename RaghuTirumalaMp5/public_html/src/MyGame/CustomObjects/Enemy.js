/* 
 * Enemy.js
 * 
 * Contains all behavior for Enemy game object
 */

/* global GameObject, gEngine, vec2 */

function Enemy(texture, xLoc, yLoc) {
    var enemyRenderable = new SpriteAnimateRenderable(texture);
    enemyRenderable.setSpriteSequence(512, 0,
                                       204, 164,
                                       5,
                                       0);
    enemyRenderable.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
    enemyRenderable.setAnimationSpeed(10);

    enemyRenderable.getXform().setPosition(xLoc, yLoc);
    enemyRenderable.getXform().setSize(12, 9.6);
    
    var enemyCircle = new Circle([xLoc, yLoc], 4, true);
    
    GameObject.call(this, enemyRenderable, enemyCircle);
    
    this.setSpeed(1/3);
    this.setCurrentFrontDir(vec2.fromValues(2 * (Math.random() - 0.5), 2 * (Math.random() - 0.5)));
    
    this.showBounds = false;
    this.rotationDirection = 1;
}
gEngine.Core.inheritPrototype(Enemy, GameObject);

Enemy.prototype.draw = function(camera) {
    this.getRenderable().draw(camera);
    if(this.showBounds) {
        this.getPhysicsComponent().draw(camera);
    }
};

Enemy.prototype.update = function(camera) {
    var delta = 0.1;
    var pos = this.getXform().getPosition();
    vec2.scaleAndAdd(pos, pos, this.getCurrentFrontDir(), this.getSpeed());
    
    if(this.isSelected) {
        if(gEngine.Input.isKeyPressed(gEngine.Input.keys.Up)) {
            this.getPhysicsComponent().incRadBy(delta);
        }

        if(gEngine.Input.isKeyPressed(gEngine.Input.keys.Down)) {
            this.getPhysicsComponent().incRadBy(-delta);
        }
    }
    
    //Toggle showing bounds
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.T)) {
        this.showBounds = !this.showBounds;
    }
    
    if(this.getXform().getRotationInRad() >= 1) {
        this.rotationDirection = -1;
    } else if(this.getXform().getRotationInRad() <= -1) {
        this.rotationDirection = 1;
    }
    this.getXform().incRotationByRad(this.rotationDirection * 0.01);
    this.getPhysicsComponent().updatePosAndRad(this.getXform().getPosition(), 
                this.getPhysicsComponent().getRadius());
                
    if(this.getXform().getXPos() >= 100 || this.getXform().getXPos() <= 0 ||
       this.getXform().getYPos() >= 75 || this.getXform().getYPos() <= 0) {
        this.setSpeed(-1 * this.getSpeed());
    };
    this.getRenderable().updateAnimation();
    
};