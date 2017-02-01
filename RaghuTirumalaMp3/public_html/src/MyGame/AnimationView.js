/* 
 * AnimationView.js
 * This class controls the camera and animated sprite for the animation
 * view in MyGame.js
 */

function AnimationView(interactiveBound, spriteSource) {
    this.kMinionSprite = $('#Dropdown').val();
    this.interactiveBound = interactiveBound;
    this.spriteSource = spriteSource;
    
    var bounds = this.interactiveBound.getBounds();
    var minX = bounds[0];
    var maxX = bounds[1];
    var minY = bounds[2];
    var maxY = bounds[3];
    
    var boundWidth = maxX - minX;
    var boundHeight = maxY - minY;
    
    var boundsSource = this.spriteSource.getBounds();
    var minXSource = boundsSource[0];
    var maxXSource = boundsSource[1];
    var minYSource = boundsSource[2];
    var maxYSource = boundsSource[3];
    
    var sourceWidth = maxXSource - minXSource;
    var sourceHeight = maxYSource - minYSource;
    
    //Distance from Top left coordinate of source in WC 
    var splitX = minX - minXSource;
    var splitY = maxY - minYSource;
    
    var uvX = splitX / sourceWidth;
    var uvY = splitY / sourceHeight;
    
    var uvWidth = boundWidth / sourceWidth;
    var uvHeight = boundHeight / sourceHeight;
    
    this.animationCam = new Camera(
        vec2.fromValues(0, 0),   // position of the camera
        boundWidth,                       // width of camera
        [0, 240, 160, 240]           // viewport (orgX, orgY, width, height)
    );
    
    this.animationCam.setBackgroundColor([0, 1, 0.5, 0]);
    this.mMinion = new SpriteAnimateRenderable(this.kMinionSprite);
    this.mMinion.setColor([1, 1, 1, 0]);
    this.mMinion.getXform().setPosition(0, 0);
    this.mMinion.getXform().setSize(boundWidth, boundWidth * 1.25);
    this.mMinion.setSpriteSequenceUV(uvY, uvX,     // first element pixel position in UV
                                    uvWidth, uvHeight,    // widthxheight in UV
                                    this.interactiveBound.numFrames(), // number of elements in this sequence
                                    0);         // horizontal padding in between
    this.mMinion.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
    this.mMinion.setAnimationSpeed(60);
}

AnimationView.prototype.draw = function() {
  this.animationCam.setupViewProjection();
  this.mMinion.draw(this.animationCam.getVPMatrix());
};

AnimationView.prototype.update = function() {
    this.mMinion.updateAnimation();
};

AnimationView.prototype.updatePosition = function() {
    var bounds = this.interactiveBound.getBounds();
    var minX = bounds[0];
    var maxX = bounds[1];
    var minY = bounds[2];
    var maxY = bounds[3];
    
    var boundWidth = maxX - minX;
    var boundHeight = maxY - minY;
    
    var boundsSource = this.spriteSource.getBounds();
    var minXSource = boundsSource[0];
    var maxXSource = boundsSource[1];
    var minYSource = boundsSource[2];
    var maxYSource = boundsSource[3];
    
    var sourceWidth = maxXSource - minXSource;
    var sourceHeight = maxYSource - minYSource;
    
    //Distance from Top left coordinate of source in WC 
    var splitX = minX - minXSource;
    var splitY = maxY - minYSource;
    
    var uvX = splitX / sourceWidth;
    var uvY = splitY / sourceHeight;
    
    var uvWidth = boundWidth / sourceWidth;
    var uvHeight = boundHeight / sourceHeight;
    
    this.animationCam.setWCWidth(boundWidth);
    
    this.mMinion.getXform().setSize(boundWidth, boundWidth * 1.25)
    this.mMinion.setSpriteSequenceUV(uvY, uvX,     // first element pixel position in UV
        uvWidth, uvHeight,    // widthxheight in UV
        this.interactiveBound.numFrames(), // number of elements in this sequence
        0);         // horizontal padding in between
};
