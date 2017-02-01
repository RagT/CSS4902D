/* 
 * InteractiveBound.js
 * Class that controls creation, drawing, and movement of the InteractiveBound
 * in MyGame.js
 */

//Initialize bound with starting coordinates wcX and wcY and image
//to render.
function InteractiveBound(image, wcX, wcY) {
    var startingSize = 50; //Starting bound size in WC units
    
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
}


