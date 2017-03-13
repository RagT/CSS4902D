/* 
 * General Object class for common functionality
 */

/* global GameObject, gEngine */

var RigidObject = function(renderableObj) {
    this.kDelta = 0.1;
    this.isSelected = false;
    this.showTarget = false;
    GameObject.call(this, renderableObj);
    
    this.targetRenderable = new SpriteRenderable("assets/target.png");
};
gEngine.Core.inheritPrototype(RigidObject, GameObject);

RigidObject.prototype.update = function() {
    
    if(this.isSelected) {
        this.showTarget = true;
        if(gEngine.Input.isKeyPressed(gEngine.Input.keys.W)) {
            this.getRigidBody().incVelocityBy([0,1]);
        }
        if(gEngine.Input.isKeyPressed(gEngine.Input.keys.A)) {
            this.getRigidBody().incVelocityBy([-1,0]);
        }
        if(gEngine.Input.isKeyPressed(gEngine.Input.keys.S)) {
            this.getRigidBody().incVelocityBy([0,-1]);
        }
        if(gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
            this.getRigidBody().incVelocityBy([1,0]);
        }
        if(gEngine.Input.isKeyPressed(gEngine.Input.keys.F) &&
           gEngine.Input.isKeyPressed(gEngine.Input.keys.Up)) {
            this.getRigidBody().incFrictionBy(this.kDelta);
        }
        if(gEngine.Input.isKeyPressed(gEngine.Input.keys.F) &&
           gEngine.Input.isKeyPressed(gEngine.Input.keys.Down)) {
            this.getRigidBody().incFrictionBy(-this.kDelta);
        }
        if(gEngine.Input.isKeyPressed(gEngine.Input.keys.M) &&
           gEngine.Input.isKeyPressed(gEngine.Input.keys.Up)) {
            this.getRigidBody().incMassBy(this.kDelta);
        }
        if(gEngine.Input.isKeyPressed(gEngine.Input.keys.M) &&
           gEngine.Input.isKeyPressed(gEngine.Input.keys.Down)) {
            this.getRigidBody().incMassBy(-this.kDelta);
        }
        if(gEngine.Input.isKeyPressed(gEngine.Input.keys.R) &&
           gEngine.Input.isKeyPressed(gEngine.Input.keys.Up)) {
            this.getRigidBody().incRestitutionBy(this.kDelta);
        }
        if(gEngine.Input.isKeyPressed(gEngine.Input.keys.R) &&
           gEngine.Input.isKeyPressed(gEngine.Input.keys.Down)) {
            this.getRigidBody().incRestitutionBy(-this.kDelta);
        }
    } else {
        this.showTarget = false;
    }
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.H)) {
        var randomX = gEngine.Core.getRandomInRange(-10, 10);
        var randomY = gEngine.Core.getRandomInRange(-10, 10);
        this.getRigidBody().incVelocityBy([randomX, randomY]);
    }
    this.updateTarget();
    GameObject.prototype.update.call(this);
};

RigidObject.prototype.draw = function(camera) {
    GameObject.prototype.draw.call(this, camera);
    if(this.showTarget) {
        this.targetRenderable.draw(camera);
    }
};

RigidObject.prototype.setSelected = function(b) {
    this.isSelected = b;
};

RigidObject.prototype.updateTarget = function() {
    var xForm = this.renderable.getXform();
    this.targetRenderable.getXform().setPosition(xForm.getXPos(), xForm.getYPos());
    this.targetRenderable.getXform().setSize(xForm.getWidth(), xForm.getHeight());
};