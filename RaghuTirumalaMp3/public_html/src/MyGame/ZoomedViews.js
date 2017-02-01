/* 
 * ZoomedView.js
 * Class for four cameras that focus on sides of InteractiveBound object
 */

//Takes a reference to an InteractiveBound object
function ZoomedViews(interactiveBound) {
    this.interactiveBound = interactiveBound;
    var bounds = this.interactiveBound.getBounds();
    var minX = bounds[0];
    var maxX = bounds[1];
    var minY = bounds[2];
    var maxY = bounds[3];
    
    var camWidth = interactiveBound.getSize()[0] / 2;
    
    //Starting camera location
    var topCamXPos = (minX + maxX) / 2;
    var topCamYPos = maxY;
    
    var bottomCamXPos = (minX + maxX) / 2;
    var bottomCamYPos = minY;
    
    var leftCamXPos = minX;
    var leftCamYPos = (minY + maxY) / 2;
    
    var rightCamXPos = maxX;
    var rightCamYPos = (minY + maxY) / 2;
    
    //Create the cameras
    this.topCamera = new Camera(
        vec2.fromValues(topCamXPos, topCamYPos),   // position of the camera
        camWidth,                                  // width of camera
        [40, 160, 80, 80]         // viewport (orgX, orgY, width, height)
    );
    this.topCamera.setBackgroundColor([1, 1, 1, 1]); //white
    
    this.bottomCamera = new Camera(
        vec2.fromValues(bottomCamXPos, bottomCamYPos),   // position of the camera
        camWidth,                                  // width of camera
        [40, 0, 80, 80]         // viewport (orgX, orgY, width, height)
    );
    this.bottomCamera.setBackgroundColor([1, 1, 1, 1]); //white
    
    this.leftCamera = new Camera(
        vec2.fromValues(leftCamXPos, leftCamYPos),   // position of the camera
        camWidth,                                  // width of camera
        [0, 80, 80, 80]         // viewport (orgX, orgY, width, height)
    );
    this.leftCamera.setBackgroundColor([1, 1, 1, 1]); //white
    
    this.rightCamera = new Camera(
        vec2.fromValues(rightCamXPos, rightCamYPos),   // position of the camera
        camWidth,                                  // width of camera
        [80, 80, 80, 80]         // viewport (orgX, orgY, width, height)
    );
    this.rightCamera.setBackgroundColor([1, 1, 1, 1]); //white
}

//Set up cameras
ZoomedViews.prototype.getCameras = function() {
    var cameras = [];
    cameras.push(this.topCamera);
    cameras.push(this.bottomCamera);
    cameras.push(this.leftCamera);
    cameras.push(this.rightCamera);
    return cameras;
};

ZoomedViews.prototype.updateCameraPos = function() {
   var bounds = this.interactiveBound.getBounds();
    var minX = bounds[0];
    var maxX = bounds[1];
    var minY = bounds[2];
    var maxY = bounds[3];
    
    //Starting camera location
    var topCamXPos = (minX + maxX) / 2;
    var topCamYPos = maxY;
    
    var bottomCamXPos = (minX + maxX) / 2;
    var bottomCamYPos = minY;
    
    var leftCamXPos = minX;
    var leftCamYPos = (minY + maxY) / 2;
    
    var rightCamXPos = maxX;
    var rightCamYPos = (minY + maxY) / 2;
    
    this.topCamera.setWCCenter(topCamXPos, topCamYPos);
    this.bottomCamera.setWCCenter(bottomCamXPos, bottomCamYPos);
    this.leftCamera.setWCCenter(leftCamXPos, leftCamYPos);
    this.rightCamera.setWCCenter(rightCamXPos, rightCamYPos);
};


