var canvas, engine, scene, camera, assets;

class Game{
    constructor(canvasId){
        canvas = document.getElementById(canvasId);
        engine = new BABYLON.Engine(canvas, true);

        scene = this._initScene(engine);

        initGraphConstants();

        this.loader =  new BABYLON.AssetsManager(scene);

        // An array containing the loaded assets
        assets = {};

        /*var teapot = this.loader.addMeshTask("teapot", "", "assets/", "teapot.obj");
        teapot.onSuccess = (e)=>{
            e.loadedMeshes[0].position = BABYLON.Vector3.Zero();
            console.log("success!");
        };
        teapot.onError = (e)=>{
            console.log("error!");
        };*/



        this.loader.onFinish = function (tasks) {
            // Player and arena creation when the loading is finished
            var player = new Player(this);
            var arena = new Arena(this);

            engine.runRenderLoop(function () {
                scene.render();
            });

            window.addEventListener("keyup", function(evt) {
                Game.handleUserInput(evt.keyCode);
            });
        };

        this.loader.load();

        // Resize the babylon engine when the window is resized
        window.addEventListener("resize", function () {
            if (engine) {
                engine.resize();
            }
        },false);
    }

    _initScene(engine) {
        var scene = new BABYLON.Scene(engine);

        new axis(scene, 5);



        scene.clearColor=new BABYLON.Color3(0.8,0.8,0.8);

        new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(1, 2, 1), scene);

        // Skydome
        /*var skybox = BABYLON.Mesh.CreateSphere("skyBox", 50, 1000, scene);
         skybox.layerMask = 2;

         // The sky creation
         BABYLON.Engine.ShadersRepository = "shaders/";

         var shader = new BABYLON.ShaderMaterial("gradient", scene, "gradient", {});
         shader.setFloat("offset", 200);
         shader.setColor3("topColor", BABYLON.Color3.FromInts(0,119,255));
         shader.setColor3("bottomColor", BABYLON.Color3.FromInts(240,240, 255));
         shader.backFaceCulling = false;
         skybox.material = shader;*/

        scene.gravity = new BABYLON.Vector3(0, -0.05, 0);
        var physicsPlugin = new BABYLON.OimoJSPlugin();
        scene.enablePhysics(scene.gravity, physicsPlugin);

        scene.collisionsEnabled = true;

        return scene;
    }

    static handleUserInput(keycode) {
        console.log(keycode+1000);
        switch (keycode) {
            case 49: //t
                x1.flick();
                x1.update();
                break;
            case 50:
                x2.flick();
                x2.update();
                break;
            case 51:
                x3.flick();
                x3.update();
                break;

        }
    }

    _initMesh(task) {
        this.assets[task.name] = task.loadedMeshes;
        for (var i=0; i<task.loadedMeshes.length; i++ ){
            var mesh = task.loadedMeshes[i];
            mesh.isVisible = false;
        }
    }
}

class axis {
    constructor(scene, size){
        //X axis
        var x = BABYLON.Mesh.CreateCylinder("x", size, 0.1, 0.1, 6, scene, false);
        x.material = new BABYLON.StandardMaterial("xColor", scene);
        x.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
        x.position = new BABYLON.Vector3(size/2, 0, 0);
        x.rotation.z = Math.PI / 2;

        //Y axis
        var y = BABYLON.Mesh.CreateCylinder("y", size, 0.1, 0.1, 6, scene, false);
        y.material = new BABYLON.StandardMaterial("yColor", scene);
        y.material.diffuseColor = new BABYLON.Color3(0, 1, 0);
        y.position = new BABYLON.Vector3(0, size / 2, 0);

        //Z axis
        var z = BABYLON.Mesh.CreateCylinder("z", size, 0.1, 0.1, 6, scene, false);
        z.material = new BABYLON.StandardMaterial("zColor", scene);
        z.material.diffuseColor = new BABYLON.Color3(0, 0, 1);
        z.position = new BABYLON.Vector3(0, 0, size/2);
        z.rotation.x = Math.PI / 2;
    }
}


