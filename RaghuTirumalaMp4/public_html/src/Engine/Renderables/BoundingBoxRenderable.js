/* 
 * BoundingBoxRenderable.js
 * 
 * Handles creation of renderable so user can see the bounds of a sprite's 
 * boundingbox
 */

function BoundingBoxRenderable(BoundingBox){
    this.leftSide = new LineRenderable(BoundingBox.minX(), BoundingBox.minY(),
                                       BoundingBox.minX(), BoundingBox.maxY());
    this.topSide = new LineRenderable(BoundingBox.minX(), BoundingBox.maxY(),
                                       BoundingBox.maxX(), BoundingBox.maxY());
    this.rightSide = new LineRenderable(BoundingBox.maxX(), BoundingBox.maxY(),
                                       BoundingBox.maxX(), BoundingBox.minY());     
    this.bottomSide = new LineRenderable(BoundingBox.maxX(), BoundingBox.minY(),
                                       BoundingBox.minX(), BoundingBox.minY());                                   
}

BoundingBoxRenderable.prototype.draw = function(camera) {
    this.leftSide.draw(camera);
    this.rightSide.draw(camera);
    this.topSide.draw(camera);
    this.bottomSide.draw(camera);
};

BoundingBoxRenderable.prototype.updateLines = function(BoundingBox) {
    this.leftSide.setVertices(BoundingBox.minX(), BoundingBox.minY(),
                                       BoundingBox.minX(), BoundingBox.maxY());
    this.topSide.setVertices(BoundingBox.minX(), BoundingBox.maxY(),
                                       BoundingBox.maxX(), BoundingBox.maxY());
    this.rightSide.setVertices(BoundingBox.maxX(), BoundingBox.maxY(),
                                       BoundingBox.maxX(), BoundingBox.minY());     
    this.bottomSide.setVertices(BoundingBox.maxX(), BoundingBox.minY(),
                                       BoundingBox.minX(), BoundingBox.minY());
};