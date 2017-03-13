/* 
 * General Object class for common functionality
 */

/* global GameObject, gEngine */

var RigidObject = function(renderableObj) {
    this.kDelta = 0.01;
    this.isSelected = false;
    GameObject.call(this, renderableObj);
};
gEngine.Core.inheritPrototype(RigidObject, GameObject);

RigidObject.prototype.update = function() {
    GameObject.prototype.update.call(this);
    if(this.getRigidBody() !== null && this.isSelected) {
        this.getRenderable().setColor([1,1,0,1]);
        var velocity = this.getRigidBody().getVelocity();
        if(gEngine.Input.isKeyPressed(gEngine.Input.keys.W)) {
            velocity[1] += this.kDelta;
        }
        if(gEngine.Input.isKeyPressed(gEngine.Input.keys.A)) {
            velocity[0] -= this.kDelta;
        }
        if(gEngine.Input.isKeyPressed(gEngine.Input.keys.S)) {
            velocity[1] -= this.kDelta;
        }
        if(gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
            velocity[0] += this.kDelta;
        }
    }
    this.getRenderable().setColor([1,1,1,0]);
};

RigidObject.prototype.setSelected = function(b) {
    this.isSelected = b;
};