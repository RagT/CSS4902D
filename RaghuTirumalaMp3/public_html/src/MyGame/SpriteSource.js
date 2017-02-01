/* 
 *Sprite Source class that controls drawing the SpriteSource object in MyGame
 *class.
 */

function SpriteSource(image, wcX, wcY) {
    //Get image height, width, and aspect ratio
    var texInfo = gEngine.ResourceMap.retrieveAsset(image);
    var imageW = texInfo.mWidth;
    var imageH = texInfo.mHeight;
    this.aspectRatio = imageW / imageH;
    
    //Use aspect ratio to calculate size of sprite
    var xSize = 150 * this.aspectRatio;
    var ySize = 150;
    
    //Create sprite
    this.sourceRenderable = new SpriteRenderable(image);
    this.sourceRenderable.setColor([0,0,0,0]);
    this.sourceRenderable.getXform().setPosition(wcX, wcY);
    this.sourceRenderable.getXform().setSize(xSize, ySize);
    
    //Initialize squares and border lines
    this.bottomLeftSquare = new Renderable();
    this.bottomRightSquare = new Renderable();
    this.topLeftSquare = new Renderable();
    this.topRightSquare = new Renderable();
    
    this.leftBorder = new Renderable();
    this.rightBorder = new Renderable();
    this.topBorder = new Renderable();
    this.bottomBorder = new Renderable();
    
    //Square colors
    this.bottomLeftSquare.setColor([1,0,0,1]); //red
    this.bottomRightSquare.setColor([0,1,0,1]); //green
    this.topLeftSquare.setColor([0,0,1,1]); //blue
    this.topRightSquare.setColor([0,0,0,1]); //black 
    
    //Border colors
    this.leftBorder.setColor([0,0,0,1]); //Black
    this.rightBorder.setColor([0,0,0,1]); //Black
    this.bottomBorder.setColor([0,0,0,1]); //Black
    this.topBorder.setColor([0,0,0,1]); //Black
}

SpriteSource.prototype.getAspectRatio = function() {
    return this.aspectRatio;
};

//Returns an array of bounds of the sprite source object
//[minX, maxX, miny, maxY]
SpriteSource.prototype.getBounds= function() {
    var centerX = this.sourceRenderable.getXform().getXPos();
    var centerY = this.sourceRenderable.getXform().getYPos();
    var width = this.sourceRenderable.getXform().getWidth();
    var height = this.sourceRenderable.getXform().getHeight();
    
    var bounds = [];
    bounds.push(centerX - (width / 2));
    bounds.push(centerX + (width / 2));
    bounds.push(centerY - (height / 2));
    bounds.push(centerY + (height / 2));
    return bounds;
};

//draws SpriteSource using the passed camera
SpriteSource.prototype.draw = function(camera) {
    var vpMatrix = camera.getVPMatrix();
    
    //Draw sprite
    this.sourceRenderable.draw(vpMatrix);
    
    var squareSize = 10;
    var centerX = this.sourceRenderable.getXform().getXPos();
    var centerY = this.sourceRenderable.getXform().getYPos();
    var width = this.sourceRenderable.getXform().getWidth();
    var height = this.sourceRenderable.getXform().getHeight();
    
    //Calculate positions and sizes for corner squares and borders
    
    //Squares
    this.bottomLeftSquare.getXform().setSize(squareSize, squareSize);
    this.bottomLeftSquare.getXform().setPosition(centerX - (width / 2),
    centerY - (height / 2));
    
    this.bottomRightSquare.getXform().setSize(squareSize, squareSize);
    this.bottomRightSquare.getXform().setPosition(centerX + (width / 2),
    centerY - (height /2));
      
    this.topLeftSquare.getXform().setSize(squareSize, squareSize);
    this.topLeftSquare.getXform().setPosition(centerX - (width / 2),
    centerY + (height / 2));
    
    this.topRightSquare.getXform().setSize(squareSize, squareSize);
    this.topRightSquare.getXform().setPosition(centerX + (width / 2),
    centerY + (height / 2));
    
    //Borders
    this.leftBorder.getXform().setSize(1,height);
    this.leftBorder.getXform().setPosition(centerX - (width / 2), centerY);
    
    this.rightBorder.getXform().setSize(1,height);
    this.rightBorder.getXform().setPosition(centerX + (width / 2), centerY);
    
    this.topBorder.getXform().setSize(width, 1);
    this.topBorder.getXform().setPosition(centerX, centerY + (height / 2));
    
    this.bottomBorder.getXform().setSize(width, 1);
    this.bottomBorder.getXform().setPosition(centerX, centerY - (height /2));
    
    //Draw borders
    this.leftBorder.draw(vpMatrix);
    this.rightBorder.draw(vpMatrix);
    this.topBorder.draw(vpMatrix);
    this.bottomBorder.draw(vpMatrix);
    
    //Draw squares
    this.topLeftSquare.draw(vpMatrix);
    this.topRightSquare.draw(vpMatrix);
    this.bottomLeftSquare.draw(vpMatrix);
    this.bottomRightSquare.draw(vpMatrix);
};

