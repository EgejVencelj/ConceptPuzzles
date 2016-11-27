class Arena{
    /**
     * The arena is the world where the player will evolve
     * @param scene
     * @constructor
     */
    constructor(game){
        this.game = game;

        // The arena size
        this.size = 30;
        
        let light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(1, 1, 0), scene);
        light.groundColor = BABYLON.Color3.Gray();
        light.diffuseColor = BABYLON.Color3.Gray();
        //new BABYLON.PointLight("poinLight", new BABYLON.Vector3(this.size/2, 1, this.size/2), scene);
        
        // The ground
        var ground = BABYLON.Mesh.CreateGround("ground",  this.size,  this.size, 2, scene);
        ground.position = new BABYLON.Vector3(this.size/2, 0, this.size/2)
        this.initGround(ground);

        var wall = BABYLON.Mesh.CreatePlane("wall", this.size, scene);
        wall.position = new BABYLON.Vector3(this.size/2, 3, 0);
        wall.rotation.y = Math.PI;
        wall.scaling.y = 0.2;
        this.initWall(wall);
        
        var wall = BABYLON.Mesh.CreatePlane("wall",  this.size, scene);
        wall.position = new BABYLON.Vector3(this.size, 3, this.size/2);
        wall.rotation.y = Math.PI/2;
        wall.scaling.y = 0.2;
        this.initWall(wall);
        
        var wall = BABYLON.Mesh.CreatePlane("wall",  this.size, scene);
        wall.position = new BABYLON.Vector3(this.size/2, 3, this.size);
        //wall.rotation.y = Math.PI/2;
        wall.scaling.y = 0.2;
        this.initWall(wall);
        
        var wall = BABYLON.Mesh.CreatePlane("wall",  this.size, scene);
        wall.position = new BABYLON.Vector3(0, 3, this.size/2);
        wall.rotation.y = -Math.PI/2;
        wall.scaling.y = 0.2;
        this.initWall(wall);
        
        var ceil = BABYLON.Mesh.CreatePlane("ceil",  this.size, scene);
        ceil.position = new BABYLON.Vector3(this.size/2, 6, this.size/2);
        ceil.rotation.x = -Math.PI/2;
        //ceil.scaling.y = 0.2;
        this.initWall(ceil);
        
        
        var wall = BABYLON.Mesh.CreatePlane("wall",  9, scene);
        wall.position = new BABYLON.Vector3(4.5, 3, 6);
        wall.scaling.y = 0.7;
        this.initWall(wall);
        
        var wall = BABYLON.Mesh.CreatePlane("wall",  9, scene);
        wall.position = new BABYLON.Vector3(4.5, 3, 6);
        wall.scaling.y = 0.7;
        wall.rotation.y = Math.PI;
        this.initWall(wall);
        
        var wall = BABYLON.Mesh.CreatePlane("wall",  19, scene);
        wall.position = new BABYLON.Vector3(20.5, 3, 6);
        wall.scaling.y = 0.35;
        this.initWall(wall);
        
        var wall = BABYLON.Mesh.CreatePlane("wall",  19, scene);
        wall.position = new BABYLON.Vector3(20.5, 3, 6);
        wall.rotation.y = Math.PI;
        wall.scaling.y = 0.35;
        this.initWall(wall);
        
        var wall = BABYLON.Mesh.CreatePlane("wall",  2, scene);
        wall.position = new BABYLON.Vector3(10, 4.5, 6);
        wall.scaling.y = 1.5;
        this.initWall(wall);
        var wall = BABYLON.Mesh.CreatePlane("wall",  2, scene);
        wall.position = new BABYLON.Vector3(10, 4.5, 6);
        wall.rotation.y = Math.PI;
        wall.scaling.y = 1.5;
        this.initWall(wall);
        
        
        
        
        /*var _this = this;
         setInterval(function() {
         var posX = _this._randomNumber(-_this.size/2, _this.size/2);
         var posZ = _this._randomNumber(-_this.size/2, _this.size/2);
         //var t = new Target(_this.game, posX, posZ);
         }, 1000);*/

        //new Box(new BABYLON.Vector3(4, 1, 4), true);
        //new Box(new BABYLON.Vector3(4, 3, 4), true);
        //new Box(new BABYLON.Vector3(4, 5, 4), true);
        

        
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

    initGround(mesh) {
        var groundMat = new BABYLON.StandardMaterial(mesh.name+"mat", scene);

        var groundTex = new BABYLON.Texture("assets/ground.jpg", scene);
        groundTex.uScale = 25*mesh.scaling.x;
        groundTex.vScale = 25*mesh.scaling.y;
        groundMat.diffuseTexture = groundTex;

        if (!mesh.material) {
            mesh.material = groundMat;
        }
        mesh.material.specularColor = BABYLON.Color3.Black();
        
        mesh.checkCollisions = true;
        mesh.setPhysicsState({ impostor: BABYLON.PhysicsEngine.PlaneImpostor, move:false});
    }
    
    initWall(mesh){
        var wallMat = new BABYLON.StandardMaterial(mesh.name+"mat", scene);

        var wallTex = new BABYLON.Texture("assets/wall.jpg", scene);
        wallTex.uScale = 25/mesh.scaling.y;
        wallTex.vScale = 25/mesh.scaling.x;
        wallMat.diffuseTexture = wallTex;

        if (!mesh.material) {
            mesh.material = wallMat;
        }
        mesh.material.specularColor = BABYLON.Color3.Black();
        
        mesh.checkCollisions = true;
        mesh.setPhysicsState({ impostor: BABYLON.PhysicsEngine.PlaneImpostor, move:false});
    }
}
