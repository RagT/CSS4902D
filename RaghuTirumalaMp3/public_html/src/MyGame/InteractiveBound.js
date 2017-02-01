/* 
 * InteractiveBound.js
 * Class that controls creation, drawing, and movement of the InteractiveBound
 * in MyGame.js
 */

//Initialize bound with starting coordinates wcX and wcY and image
//to render.
function InteractiveBound(image, wcX, wcY, bounds, isPreview) {
    var startingSize = 50; //Starting bound size in WC units
    this.isPreview = isPreview;
    
    //Array of bounding coordinates for scaling/moving bound
    this.sourceBounds = bounds;
    
    //Initialize bound sprite
    this.boundRenderable = new SpriteRenderable(image);
    this.boundRenderable.setColor([0,0,0,0]);
    this.boundRenderable.getXform().setPosition(wcX,wcY);
    this.boundRenderable.getXform().setSize(startingSize,startingSize);
   
    var squareSize = 5;
    
    //Bound Marker Squares
    this.leftSquare = new Renderable();
    this.leftSquare.setColor([1,0,0,1]); //red
    this.leftSquare.getXform().setSize(squareSize,squareSize);
    
    this.rightSquare = new Renderable();
    this.rightSquare.setColor([0,1,0,1]); //green
    this.rightSquare.getXform().setSize(squareSize,squareSize);
    
    this.topSquare = new Renderable();
    this.topSquare.setColor([0,0,1,1]); //blue
    this.topSquare.getXform().setSize(squareSize,squareSize);
    
    this.bottomSquare = new Renderable();
    this.bottomSquare.setColor([0,0.5,0.5,1]);
    this.bottomSquare.getXform().setSize(squareSize,squareSize);
    
    this.minWidth = 0;
    
    this.minHeight = 0;
    
     //Create preview bounds if this renderable is not a preview bound itself
    this.previewBounds = [];
    if(!isPreview) {
        for(var i = 1; i <= 4; i++) {
            var boundX = wcX + i * startingSize;
            var boundRenderable = new InteractiveBound(image, boundX, wcY, bounds,
            true);
            this.previewBounds.push(boundRenderable);
        }
    } 
    
    //Flag whether or not to show previewBounds
    this.showPreview = false;
}

InteractiveBound.prototype.getPosition = function() {
    var pos = [];
    pos.push(this.boundRenderable.getXform().getXPos());
    pos.push(this.boundRenderable.getXform().getYPos());
    return pos;
};

InteractiveBound.prototype.getSize = function() {
    var sizeArr = [];
    sizeArr.push(this.boundRenderable.getXform().getWidth());
    sizeArr.push(this.boundRenderable.getXform().getHeight());
    return sizeArr;
}; 

//Takes array of two elements [width, height]
InteractiveBound.prototype.setSize = function(size) {
    this.boundRenderable.getXform().setSize(size[0], size[1]);
};

//Takes array of two elements [x, y]
InteractiveBound.prototype.setPosition = function(pos) {
    this.boundRenderable.getXform().setPosition(pos[0], pos[1]);
};
InteractiveBound.prototype.incXPos = function(delta) {
    var bounds = this.getBounds();
    if(bounds[0] + delta > this.sourceBounds[0] && 
            bounds[1] + delta < this.sourceBounds[1]) {
        this.boundRenderable.getXform().incXPosBy(delta);
    }
    this.updatePreviewBounds();
};

InteractiveBound.prototype.incYPos = function(delta) {
    var bounds = this.getBounds();
    if(bounds[2] + delta > this.sourceBounds[2] && 
            bounds[3] + delta < this.sourceBounds[3]) {
        this.boundRenderable.getXform().incYPosBy(delta);
    }
    this.updatePreviewBounds();
};

InteractiveBound.prototype.incWidth = function(delta) {
    var bounds = this.getBounds();
    var width = bounds[1] - bounds[0];
    
    if(bounds[0] - delta < this.sourceBounds[0] ||
            bounds[1] + delta > this.sourceBounds[1]) {
        return;
    }
    if((delta + width) > this.minWidth) {
        this.boundRenderable.getXform().incWidthBy(delta);
    }
    this.updatePreviewBounds();
};

InteractiveBound.prototype.incHeight = function(delta) {
    var bounds = this.getBounds();
    var height = bounds[3] - bounds[2];
    
    if(bounds[2] - delta < this.sourceBounds[2] ||
            bounds[3] + delta > this.sourceBounds[3]) {
        return;
    }
    if((delta + height) > this.minHeight) {
        this.boundRenderable.getXform().incHeightBy(delta);
    }
    this.updatePreviewBounds();
};

InteractiveBound.prototype.updatePreviewBounds = function() {
    var centerX = this.boundRenderable.getXform().getXPos();
    var centerY = this.boundRenderable.getXform().getYPos();
    var width = this.boundRenderable.getXform().getWidth();
    var height = this.boundRenderable.getXform().getHeight();
    
    for(var i = 1; i <= this.previewBounds.length; i++) {
        this.previewBounds[i - 1].setSize([width, height]);
        this.previewBounds[i - 1].setPosition([centerX + (i * width), centerY]);
    }
};

InteractiveBound.prototype.togglePreview = function() {
    this.showPreview = !this.showPreview;
};

//Checks if bound is within SpriteSource object
InteractiveBound.prototype.isInBounds = function() {
    var bounds = this.getBounds();
    if(bounds[0] < this.sourceBounds[0]) {
        return false;
    }
    if(bounds[1] > this.sourceBounds[1]) {
        return false;
    }
    if(bounds[2] < this.sourceBounds[2]) {
        return false;
    }
    if(bounds[3] > this.sourceBounds[3]) {
        return false;
    }
    return true;
};

//Returns an array of bounds of the InteractiveBound object
//[minX, maxX, miny, maxY]
InteractiveBound.prototype.getBounds = function() {
    var centerX = this.boundRenderable.getXform().getXPos();
    var centerY = this.boundRenderable.getXform().getYPos();
    var width = this.boundRenderable.getXform().getWidth();
    var height = this.boundRenderable.getXform().getHeight();
    
    var bounds = [];
    bounds.push(centerX - (width / 2));
    bounds.push(centerX + (width / 2));
    bounds.push(centerY - (height / 2));
    bounds.push(centerY + (height / 2));
    return bounds;
};

InteractiveBound.prototype.draw = function(camera) {
    vpMatrix = camera.getVPMatrix();
    
    //draw sprite
    this.boundRenderable.draw(vpMatrix);
    
    //calculate bound marker locations
    var centerX = this.boundRenderable.getXform().getXPos();
    var centerY = this.boundRenderable.getXform().getYPos();
    var width = this.boundRenderable.getXform().getWidth();
    var height = this.boundRenderable.getXform().getHeight();
    
    this.leftSquare.getXform().setPosition(centerX - (width / 2), centerY);
    this.rightSquare.getXform().setPosition(centerX + (width / 2), centerY);
    this.topSquare.getXform().setPosition(centerX, centerY + (height / 2));
    this.bottomSquare.getXform().setPosition(centerX, centerY - (height / 2));
    
    //draw the squares
    this.leftSquare.draw(vpMatrix);
    this.rightSquare.draw(vpMatrix);
    this.topSquare.draw(vpMatrix);
    this.bottomSquare.draw(vpMatrix);
    
    //If showPreview flag is true show the preview bounds
    if(this.showPreview) {
        for(var i = 0; i < this.previewBounds.length; i++) {
            if(this.previewBounds[i].isInBounds()) {
                this.previewBounds[i].draw(camera);
            }
        }
    }
}


