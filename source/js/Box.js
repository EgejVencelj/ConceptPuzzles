class Box{
    constructor(spawnPoint, physics){
        var _this = this;

        this.mesh = BABYLON.Mesh.CreateBox("box", 1.0, scene);
        this.mesh.position = spawnPoint;


        /*if(physics){
            this.mesh.applyGravity = true;
            this.mesh.physicsImpostor = new BABYLON.PhysicsImpostor(this.mesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.9}, scene);
            this.mesh.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(3,1,0,0));
        }*/

        // Check collisions
        this.checkCollisions = true;
    }
}