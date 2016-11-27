var canvas, engine, scene, camera, assets, timer;

class Game{

    static getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    constructor(canvasId){
        canvas = document.getElementById(canvasId);
        engine = new BABYLON.Engine(canvas, true);
        scene = this._initScene(engine);

        initGraphConstants();
        this.loader =  new BABYLON.AssetsManager(scene);
        timer = new Timer();

        assets = {};

        let rc = new MeshClickEvent(this, ()=>{
            let respones = ["Hey!", "Haha", "Stop it!", "Hurry", "You again"];
            println("Gamma: " + respones[Game.getRandomInt(0,respones.length)], "green");
        });


        var robot = this.loader.addMeshTask("robot", "", "assets/", "BlackAndRedFloatingRobot.obj");
        robot.onSuccess = (e)=>{
            for(var i=0; i<e.loadedMeshes.length; i++){
                e.loadedMeshes[i].position.y += 2;
                e.loadedMeshes[i].position.x += 15;
                e.loadedMeshes[i].position.z += 3;
                e.loadedMeshes[i].checkCollisions = true;
                e.loadedMeshes[i].animations = [];
                rc.attach(e.loadedMeshes[i]);

                var a = new BABYLON.Animation(
                    "a",
                    "position.y", 10,
                    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
                    BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

                var keys = [];
                keys.push({frame: 0, value: e.loadedMeshes[i].position.y});
                keys.push({frame: 5, value: e.loadedMeshes[i].position.y + 0.5});
                keys.push({frame: 10, value: e.loadedMeshes[i].position.y});
                a.setKeys(keys);

                var easingFunction = new BABYLON.SineEase();
                easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEIOUT);
                a.setEasingFunction(easingFunction);

                e.loadedMeshes[i].animations.push(a);
                scene.beginAnimation(e.loadedMeshes[i], 0, 10, true, 0.5, this.setEnableJump);
            }
        };



        this.loader.onFinish = function (tasks) {
            var player = new Player(this);
            var arena = new Arena(this);

            engine.runRenderLoop(function () {
                timer.update();
                scene.render();
            });

            window.addEventListener("keyup", function(evt) {
                Game.handleUserInput(evt.keyCode);
            });
        };

        this.loader.load();
        window.addEventListener("resize", function () {
            if (engine) {
                engine.resize();
            }
        },false);
    }

    _initScene(engine) {
        var scene = new BABYLON.Scene(engine);
        scene.clearColor=new BABYLON.Color3(0.8,0.8,0.8);
        scene.gravity = new BABYLON.Vector3(0, -10, 0);
        var physicsPlugin = new BABYLON.OimoJSPlugin();
        scene.enablePhysics(scene.gravity, physicsPlugin);

        scene.collisionsEnabled = true;

        return scene;
    }

    _initMesh(task) {
        this.assets[task.name] = task.loadedMeshes;
        for (var i=0; i<task.loadedMeshes.length; i++ ){
            var mesh = task.loadedMeshes[i];
            mesh.isVisible = false;
        }
    }
}


