Box = function(spawnPoint, physics){
    var _this = this;
  
  
    
    this.mesh = BABYLON.Mesh.CreateBox("box", 1.0, scene);
    this.mesh.position = spawnPoint;

    if(physics){
        this.mesh.applyGravity = true;
        this.mesh.setPhysicsState({impostor:BABYLON.PhysicsEngine.BoxImpostor, move:true, mass:1, friction:0.5, restitution:0.1});
    }
    
    // Check collisions
    this.checkCollisions = true;

};

Box.prototype = {
    constructor: Box
};