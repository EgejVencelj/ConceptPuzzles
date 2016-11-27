class Arena{
    /**
     * The arena is the world where the player will evolve
     * @param scene
     * @constructor
     */
    constructor(game){
        this.game = game;

        // The arena size
        this.size = 100;

        // The ground
        var ground = BABYLON.Mesh.CreateGround("ground",  this.size,  this.size, 2, scene);
        //var ground = BABYLON.Mesh.CreateBox("ground",  this.size, scene);
        //    ground.position.y = -50;
        this._deactivateSpecular(ground);
        ground.checkCollisions = true;
        ground.setPhysicsState({ impostor: BABYLON.PhysicsEngine.PlaneImpostor, move:false});


        /*var _this = this;
         setInterval(function() {
         var posX = _this._randomNumber(-_this.size/2, _this.size/2);
         var posZ = _this._randomNumber(-_this.size/2, _this.size/2);
         //var t = new Target(_this.game, posX, posZ);
         }, 1000);*/

        new Box(new BABYLON.Vector3(0, 1, 0), true);
        new Box(new BABYLON.Vector3(0, 3, 0), true);
        new Box(new BABYLON.Vector3(0, 5, 0), true);
        

        
        /*var robot = BABYLON.Mesh.CreateTorusKnot("mesh", 0.3, 0.05, 256, 64, 4, 10, scene);
        robot.position.y = 5;*/
        
        /*var amigaMaterial = new BABYLON.ShaderMaterial("amiga", scene, {
            vertexElement: "vertexShaderCode",
            fragmentElement: "fragmentShaderCode",
        },
        {
            attributes: ["position", "uv"],
            uniforms: ["worldViewProjection"]
        });
        amigaMaterial.setTexture("textureSampler", new BABYLON.Texture("assets/sky.jpg", scene));
 
        robot.material = amigaMaterial;*/
        
        initPuzzles(scene);
    }

    /**
     * Generates a random number between min and max
     * @param min
     * @param max
     * @returns {number}
     * @private
     */
    _randomNumber (min, max) {
        if (min == max) {
            return (min);
        }
        var random = Math.random();
        return ((random * (max - min)) + min);
    }

    _deactivateSpecular(mesh) {
        var groundMat = new BABYLON.StandardMaterial(mesh.name+"mat", scene);

        var groundTex = new BABYLON.Texture("assets/ground.jpg", scene);
        groundTex.uScale = 15;
        groundTex.vScale = 15;
        groundMat.diffuseTexture = groundTex;

        if (!mesh.material) {
            mesh.material = groundMat;
        }
        mesh.material.specularColor = BABYLON.Color3.Black();
    }
}
