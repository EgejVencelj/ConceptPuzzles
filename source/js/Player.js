class Player{
    /**
     * A player is represented by a box and a free camera.
     * @param scene
     * @param game
     * @param spawnPoint The spawning point of the player
     * @constructor
     */
    constructor(game, spawnPoint) {
        // The player eyes height
        this.height = 1;

        if (!spawnPoint) {
            spawnPoint = new BABYLON.Vector3(0, 2*this.height, -10);
        }

        // The player spawnPoint
        this.spawnPoint = spawnPoint;
        // The game scene
        this.scene = game.scene;
        // The game
        this.game = game;

        // The player speed
        this.speed = 10;

        this.walkSpeed = this.speed;
        this.sprintSpeed = 2*this.speed;

        this.enableJump = true;
        // The player inertia
        this.inertia = 0;
        // The player angular inertia
        //this.angularInertia = 0.5;
        // The mouse sensibility (lower the better sensible)
        this.angularSensibility = 1000;
        // The player camera
        this.camera = this._initCamera();
        // The player must click on the canvas to activate control
        this.controlEnabled = false;
        // The player weapon
        //this.weapon = new Weapon(game, this);
        var _this = this;

        var canvas = engine.getRenderingCanvas();
        // Event listener on click on the canvas
        /*canvas.addEventListener("click", function(evt) {
         var width = _this.scene.getEngine().getRenderWidth();
         var height = _this.scene.getEngine().getRenderHeight();

         if (_this.controlEnabled) {
         var pickInfo = _this.scene.pick(width/2, height/2, null, false, _this.camera);
         _this.handleUserMouse(evt, pickInfo);
         }
         }, false);*/

        // Event listener to go pointer lock
        this._initPointerLock();

        // The representation of player in the minimap
        /*var s = BABYLON.Mesh.CreateSphere("player2", 16, 4, this.scene);
         s.position.y = 10;
         s.registerBeforeRender(function() {
         s.position.x = _this.camera.position.x;
         s.position.z = _this.camera.position.z;
         });

         var red = new BABYLON.StandardMaterial("red", this.scene);
         red.diffuseColor = BABYLON.Color3.Red();
         red.specularColor = BABYLON.Color3.Black();
         s.material = red;
         s.layerMask = 1;*/

        // Set the active camera for the minimap
        scene.activeCameras.push(this.camera);
        scene.activeCamera = this.camera;

        window.addEventListener("keydown", function(evt) {
            _this.handleKeyDown(evt.keyCode);
        });
        window.addEventListener("keyup", function(evt) {
            _this.handleKeyUp(evt.keyCode);
        });


        this.setEnableJump = function(){
            _this.enableJump = true;
        },

            this.setDisableJump = function(){
                _this.enableJump = false;
            }
    }

    _initPointerLock() {
        var _this = this;
        // Request pointer lock
        var canvas = engine.getRenderingCanvas();
        canvas.addEventListener("click", function(evt) {
            canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
            if (canvas.requestPointerLock) {
                canvas.requestPointerLock();
            }
        }, false);

        // Event listener when the pointerlock is updated.
        var pointerlockchange = function (event) {
            _this.controlEnabled = (document.mozPointerLockElement === canvas || document.webkitPointerLockElement === canvas || document.msPointerLockElement === canvas || document.pointerLockElement === canvas);
            if (!_this.controlEnabled) {
                _this.camera.detachControl(canvas);
            } else {
                _this.camera.attachControl(canvas);
            }
        };
        document.addEventListener("pointerlockchange", pointerlockchange, false);
        document.addEventListener("mspointerlockchange", pointerlockchange, false);
        document.addEventListener("mozpointerlockchange", pointerlockchange, false);
        document.addEventListener("webkitpointerlockchange", pointerlockchange, false);
    }

    /**
     * Init the player camera
     * @returns {BABYLON.FreeCamera}
     * @private
     */
    _initCamera() {
        var camera = new BABYLON.FreeCamera("camera", this.spawnPoint, scene);
        camera.attachControl(scene.getEngine().getRenderingCanvas());
        camera.ellipsoid = new BABYLON.Vector3(1, this.height, 1);
        camera.collisionRadius = new BABYLON.Vector3(0.5, 0.5, 0.5)
        camera.checkCollisions = true;
        camera.applyGravity = true;


        //.setPhysicsState({impostor:BABYLON.PhysicsEngine.SphereImpostor, move:true});
        // WASD
        camera.keysUp = [87]; // Z -> W
        camera.keysDown = [83]; // S
        camera.keysLeft = [65]; // Q -> A
        camera.keysRight = [68]; // D
        camera.speed = this.speed;
        camera.inertia = this.inertia;
        camera.angularInertia = this.angularInertia;
        camera.angularSensibility = this.angularSensibility;
        //camera.layerMask = 2;

        return camera;
    }

    /**
     * Handle the user input on keyboard
     * @param keycode
     */
    handleKeyDown(keycode) {
        console.log(keycode);
        switch (keycode) {
            case 16:{//Shift
                this.camera.speed = this.sprintSpeed;
                break;
            }
            case 32:{//space
                this.jump();
                break;
            }
        }
    }

    /**
     * Handle the user input on keyboard
     * @param keycode
     */
    handleKeyUp(keycode) {
        switch (keycode) {
            case 16:{//Shift
                this.camera.speed = this.walkSpeed;
                break;
            }
        }
    }

    /**
     * Handle the user input on mouse.
     * click = shoot
     * @param evt
     * @param pickInfo The pick data retrieved when the click has been done
     */
    handleUserMouse(evt, pickInfo) {
        this.weapon.fire(pickInfo);
    }

    /**
     * Make the player jump
     *
     **/
    jump(){
        if(this.enableJump == false){
            return;
        }

        var cam = this.camera;

        cam.animations = [];

        var a = new BABYLON.Animation(
            "a",
            "position.y", 20,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

        // Animation keys
        var keys = [];
        keys.push({ frame: 0, value: cam.position.y });
        keys.push({ frame: 10, value: cam.position.y + 2 });
        //keys.push({ frame: 20, value: cam.position.y });
        a.setKeys(keys);

        var easingFunction = new BABYLON.CircleEase();
        easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEIOUT);
        a.setEasingFunction(easingFunction);


        cam.animations.push(a);

        this.setDisableJump();
        scene.beginAnimation(cam, 0, 10, false, 1, this.setEnableJump);
    }
}