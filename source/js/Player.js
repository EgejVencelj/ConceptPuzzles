class Player {

    constructor(game, spawnPoint) {
        this.height = 1;
        if (!spawnPoint) {
            spawnPoint = new BABYLON.Vector3(1, 2 * this.height, 1);
        }

        this.spawnPoint = spawnPoint;
        this.scene = game.scene;
        this.speed = 5;
        this.walkSpeed = this.speed;
        this.sprintSpeed = 2 * this.speed;
        this.enableJump = true;
        this.camera = this._initCamera();

        this.controlEnabled = false;
        var _this = this;
        var canvas = engine.getRenderingCanvas();
        this._initPointerLock();
        this._initPicker();

        scene.activeCameras.push(this.camera);
        scene.activeCamera = this.camera;

        window.addEventListener("keydown", function (evt) {
            _this.handleKeyDown(evt.keyCode);
        });
        window.addEventListener("keyup", function (evt) {
            _this.handleKeyUp(evt.keyCode);
        });


        this.setEnableJump = function () {
            _this.enableJump = true;
        }

            this.setDisableJump = function () {
                _this.enableJump = false;
            }
    }

    _initPointerLock() {
        var canvas = engine.getRenderingCanvas();
        canvas.addEventListener("click", function (evt) {
            canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
            if (canvas.requestPointerLock) {
                canvas.requestPointerLock();
            }
        }, false);


        var pointerlockchange = function (event) {
            this.controlEnabled = (document.mozPointerLockElement === canvas || document.webkitPointerLockElement === canvas || document.msPointerLockElement === canvas || document.pointerLockElement === canvas);
            if (!this.controlEnabled) {
                this.camera.detachControl(canvas);
            } else {
                this.camera.attachControl(canvas);
            }
        };
        document.addEventListener("pointerlockchange", pointerlockchange, false);
        document.addEventListener("mspointerlockchange", pointerlockchange, false);
        document.addEventListener("mozpointerlockchange", pointerlockchange, false);
        document.addEventListener("webkitpointerlockchange", pointerlockchange, false);
    }


    _initPicker() {
        canvas.addEventListener("click", (evt) => {
            let width = scene.getEngine().getRenderWidth();
            let height = scene.getEngine().getRenderHeight();
            let info =  scene.pick(width / 2, height / 2, null, false, camera);


            if(info.pickedMesh.meshClickEvent != null){
                info.pickedMesh.meshClickEvent.click();
            }
        }, false);

    }

    _initCamera() {
        var camera = new BABYLON.FreeCamera("camera", this.spawnPoint, scene);
        camera.attachControl(scene.getEngine().getRenderingCanvas());
        camera.ellipsoid = new BABYLON.Vector3(0.75, this.height, 0.75);
        camera.checkCollisions = true;
        camera.applyGravity = true;

        //.setPhysicsState({impostor:BABYLON.PhysicsEngine.SphereImpostor, move:true});

        camera.keysUp = [87]; // Z -> W
        camera.keysDown = [83]; // S
        camera.keysLeft = [65]; // Q -> A
        camera.keysRight = [68]; // D

        camera.speed = this.speed;
        camera.inertia = 0;
              camera.angularSensibility = 1000;

        camera.setTarget(new BABYLON.Vector3(2, 1.5, 2));

        return camera;
    }


    handleKeyDown(keycode) {
        console.log(keycode);
        switch (keycode) {
            case 16: {//Shift
                this.camera.speed = this.sprintSpeed;
                break;
            }
            case 32: {//space
                this.jump();
                break;
            }
        }
    }

    handleKeyUp(keycode) {
        switch (keycode) {
            case 16: {//Shift
                this.camera.speed = this.walkSpeed;
                break;
            }
        }
    }

    handleUserMouse(evt, pickInfo) {
        this.weapon.fire(pickInfo);
    }


    jump() {
        if (this.enableJump == false) {
            return;
        }

        var cam = this.camera;
        cam.animations = [];

        var a = new BABYLON.Animation(
            "a",
            "position.y", 10,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

        var keys = [];
        keys.push({frame: 0, value: cam.position.y});
        keys.push({frame: 5, value: cam.position.y + 1});
        keys.push({frame: 10, value: cam.position.y});
        a.setKeys(keys);

        var easingFunction = new BABYLON.CircleEase();
        easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEIOUT);
        a.setEasingFunction(easingFunction);

        cam.animations.push(a);

        this.setDisableJump();
        scene.beginAnimation(cam, 0, 10, false, 2, this.setEnableJump);
    }
}