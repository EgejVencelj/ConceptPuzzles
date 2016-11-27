"use strict";

let standardBaseMaterial;

let wireOnMaterial, wireOffMaterial, wireDisMaterial;
let lightBulbColor, lightBulbOnMaterial, lightBulbOffMaterial, lightBulbBurnerOnMaterial, lightBulbBurnerOffMaterial;
let socketMaterial, chipMaterial, copper;
let doorMaterial;


function initGraphConstants() {
    standardBaseMaterial = new BABYLON.StandardMaterial("", scene);
    standardBaseMaterial.diffuseColor = rgb(100, 27, 27);


    wireOnMaterial = new BABYLON.StandardMaterial("", scene);
    wireOnMaterial.diffuseColor = rgb(17, 108, 255);
    wireOffMaterial = new BABYLON.StandardMaterial("", scene)
    wireOffMaterial.diffuseColor = rgb(4, 50, 124);
    wireDisMaterial = new BABYLON.StandardMaterial("", scene)
    wireDisMaterial.diffuseColor = rgb(40, 40, 40);

    lightBulbColor = rgb(254, 255, 214)

    lightBulbOnMaterial = new BABYLON.StandardMaterial("", scene);
    lightBulbOnMaterial.diffuseColor = lightBulbColor;
    lightBulbOnMaterial.emissiveColor = lightBulbColor;
    lightBulbOnMaterial.alpha = 0.95;
    lightBulbBurnerOnMaterial = new BABYLON.StandardMaterial("", scene);
    lightBulbBurnerOnMaterial.diffuseColor = lightBulbColor;
    lightBulbBurnerOnMaterial.emissiveColor = lightBulbColor;

    lightBulbOffMaterial = new BABYLON.StandardMaterial("", scene);
    lightBulbOffMaterial.diffuseColor = rgb(132, 132, 132);
    lightBulbOffMaterial.alpha = 0.5;
    lightBulbBurnerOffMaterial = new BABYLON.StandardMaterial("", scene);
    lightBulbBurnerOffMaterial.diffuseColor = rgb(186, 186, 186);

    socketMaterial = new BABYLON.StandardMaterial("", scene);
    socketMaterial.diffuseColor = rgb(40, 40, 40);

    chipMaterial = new BABYLON.StandardMaterial("", scene);
    chipMaterial.diffuseColor = rgb(20, 20, 20);

    copper = new BABYLON.StandardMaterial("", scene);
    copper.diffuseColor = rgb(233, 137, 41);


    doorMaterial = new BABYLON.StandardMaterial("", scene);
    doorMaterial.diffuseColor = rgb(233, 137, 41);

    rgb(8, 118, 100)
}


class ManagedElement {

    constructor(a) {
        this.output = [];
        Object.assign(this, a); //ha
    }

    update() {
        this.updateObjectModel();
        this.updateObjectView();
    }


    chain(element, inputSlot = null) {
        this.output.push(element);
        if (!(this instanceof Timer)) {
            if (inputSlot != null) {
                element[inputSlot] = this;
            } else {
                element.input = this;
            }
        }
        if((this instanceof Socket) && (element instanceof Chip)){
            element.position = this.position;
        }
        return element;
    }


    //fires object updating even on itself and on its children
    updateObjectModel() {
        if (this.onUpdateObjectModel != null) {
            this.onUpdateObjectModel();
        }
        for (let o of this._getOutputs()) {
            if (o.updateObjectModel != null) {
                o.updateObjectModel();
            } else if (o.onUpdateObjectModel != null) {
                o.onUpdateObjectModel();
            }
        }
    }

    updateObjectView() {
        if (this.onUpdateObjectView != null) {
            this.onUpdateObjectView();
        }
        for (let o of this._getOutputs()) {
            if (o.updateObjectView != null) {
                o.updateObjectView();
            } else if (o.onUpdateObjectView != null) {
                o.onUpdateObjectView();
            }
        }
    }

    //refereces for change propagation tree
    _getOutputs() {
        if (this.output instanceof Array) {
            return this.output;
        } else if (this.output != null) {
            this.output = [this.output];
            return this.output;
        } else {
            return [];
        }
    }
}

class CircuitElement extends ManagedElement {
    //0-off, 1-on, 2-disconnected
    get status() {
        if (this._status == null || (this._status != 0 && this._status != 1)) {
            return 2;
        } else {
            return this._status;
        }
    }

    set status(val) {
        this._status = val;
    }

    hasChanged() {
        if (this._statusOld != this.status) {
            this._statusOld = this.status;
            return true;
        }
        return false;
    }
}


class Switch extends CircuitElement {
    flick() {
        this.status = (~this.status) & 1;
    }

    onUpdateObjectModel() {
    }

    onUpdateObjectView() {
        if (this.hasChanged() || this.baseMesh == null) {
            if (this.baseMesh == null) {
                let baseMesh = BABYLON.MeshBuilder.CreateBox("box", {height: 0.1}, scene);
                baseMesh.material = standardBaseMaterial;
                baseMesh.position.y = 0.05;
                baseMesh.bakeCurrentTransformIntoVertices();

                let switchMesh = BABYLON.MeshBuilder.CreateBox("box", {width: 0.1, depth: 0.1, height: 0.7}, scene);
                switchMesh.position.y = 0.35;
                switchMesh.bakeCurrentTransformIntoVertices();

                switchMesh.parent = baseMesh;

                baseMesh.position = this.position;

                this.baseMesh = baseMesh;
                this.switchMesh = switchMesh
            }

            if (this.status === 0) {
                this.switchMesh.rotation.z = Math.PI / 6;
            } else if (this.status === 1) {
                this.switchMesh.rotation.z = -Math.PI / 6;
            } else {
                this.switchMesh.rotation.z = 0;
            }


        }
    }
}


class Wire extends CircuitElement {

    onUpdateObjectModel() {
        this.status = this.input.status;
    }

    onUpdateObjectView() {
        if (this.hasChanged() || this.baseMesh == null) {
            if (this.baseMesh == null) {

                let w = this.position[1].x - this.position[0].x;
                let h = this.position[1].y - this.position[0].y;
                let d = this.position[1].z - this.position[0].z;

                let l = Math.sqrt(w * w + h * h + d * d);

                var c = BABYLON.Mesh.CreateCylinder("", l, 0.1, 0.1, 8, 1, scene, false);
                c.position = new BABYLON.Vector3(l / 2, 0, 0);
                c.rotation.z = Math.PI / 2;
                c.bakeCurrentTransformIntoVertices();
                c.rotation.z = Math.atan2(h, Math.sqrt(w * w + d * d));
                c.rotation.y = Math.atan2(-d, w);
                c.position = this.position[0];

                this.baseMesh = c;
                this.switchMesh = c
            }

            if (this.status === 0) {
                this.baseMesh.material = wireOffMaterial;
            } else if (this.status === 1) {
                this.baseMesh.material = wireOnMaterial;
            } else {
                this.baseMesh.material = wireDisMaterial;
            }

        }
    }
}

class Light extends CircuitElement {
    onUpdateObjectModel() {
        this.status = this.input.status;
    }

    onUpdateObjectView() {
        if (this.hasChanged() || this.baseMesh == null) {
            if (this.baseMesh == null) {
                let baseMesh = BABYLON.MeshBuilder.CreateBox("box", {height: 0.1}, scene);
                baseMesh.material = standardBaseMaterial;
                baseMesh.position.y = 0.05;
                baseMesh.bakeCurrentTransformIntoVertices();


                let bulb = BABYLON.Mesh.CreateSphere("", 10.0, 0.5, scene);
                bulb.scaling.y = 2;
                bulb.material = lightBulbOnMaterial;
                bulb.parent = baseMesh;

                let bulbBurner = BABYLON.Mesh.CreateSphere("", 10.0, 0.3, scene);

                bulbBurner.position.y = 0.1;
                bulbBurner.material = lightBulbBurnerOnMaterial;
                bulbBurner.parent = baseMesh;


                let light = new BABYLON.PointLight("", new BABYLON.Vector3(0, 0, 0), scene);
                light.diffuse = rgb(254, 255, 214);
                light.specular = rgb(254, 255, 214);
                light.position.y = 0.5;
                light.parent = baseMesh;


                baseMesh.position = this.position;

                this.baseMesh = baseMesh;
                this.bulbBurner = bulbBurner;
                this.bulb = bulb;
                this.light = light;

            }

            if (this.status === 0) {
                this.light.setEnabled(false)
                this.bulb.material = lightBulbOffMaterial;
                this.bulbBurner.material = lightBulbBurnerOffMaterial;

            } else if (this.status === 1) {
                this.light.setEnabled(true);
                this.bulb.material = lightBulbOnMaterial;
                this.bulbBurner.material = lightBulbBurnerOnMaterial;
            } else {
                this.light.setEnabled(false)
                this.bulb.material = lightBulbOffMaterial;
                this.bulbBurner.material = lightBulbBurnerOffMaterial;
            }


        }
    }
}

class FireOnce {
    constructor(event) {
        this.event = event;
        this.fired = false;
    }

    onUpdateObjectModel() {
        this.status = this.input.status;
        if (this.status && !this.fired) {
            this.fired = true;
            this.event();
        }
    }
}

class FireAlways {
    constructor(event) {
        this.event = event;
    }

    onUpdateObjectModel() {
        this.status = this.input.status;
        this.event(this.status);
    }
}


class Socket extends CircuitElement {

    onUpdateObjectModel() {
        this.status = 2 //magic
    }

    onUpdateObjectView() {
        if (this.hasChanged() || this.baseMesh == null) {
            if (this.baseMesh == null) {

                let a = 0.1;
                let baseMesh = getCube(0, 0, 0, 1, a, 1, null, standardBaseMaterial);
                getCube(a, a, a, 0.8, 0.1, 0.15, baseMesh, socketMaterial);
                getCube(a, a, 0.75, 0.8, 0.1, 0.15, baseMesh, socketMaterial);
                getCube(a, a, 0.2, 0.1, 0.1, 0.6, baseMesh, socketMaterial);
                getCube(0.8, a, 0.2, 0.1, 0.1, 0.6, baseMesh, socketMaterial);
                getCube(0.2, a, 0.2, 0.6, 0.01, 0.6, baseMesh, copper);
                getCube(0.2, a, 0.25, 0.6, 0.05, 0.1, baseMesh, socketMaterial);
                getCube(0.2, a, 0.65, 0.6, 0.05, 0.1, baseMesh, socketMaterial);
                getCube(0.2, a, 0.425, 0.6, 0.05, 0.15, baseMesh, socketMaterial);
                getCube(0.2, a, 0.25, 0.05, 0.05, 0.5, baseMesh, socketMaterial);
                getCube(0.35, a, 0.25, 0.1, 0.05, 0.5, baseMesh, socketMaterial);
                getCube(0.75, a, 0.25, 0.05, 0.05, 0.5, baseMesh, socketMaterial);
                getCube(0.55, a, 0.25, 0.1, 0.05, 0.5, baseMesh, socketMaterial);

                baseMesh.position = this.position;
                this.baseMesh = baseMesh;

            }
        }
    }
}

class Chip extends CircuitElement {
    onUpdateObjectModel() {
        let A, B, C;
        if (this.input.inputA == null) {
            A = 2;
        } else {
            A = this.input.inputA.status;
        }
        if (this.input.inputB == null) {
            B = 2;
        } else {
            B = this.input.inputB.status;
        }

        if (A == 2 || B == 2) {
            C = 2;
        } else {
            C = this.Eval(A, B);
        }
        this.input.status = C;
    }

    onUpdateObjectView() {
        if (this.hasChanged() || this.baseMesh == null) {
            if (this.baseMesh == null) {

                let baseMesh = getCube(0.2, 0.175, 0.25, 0.6, 0.1, 0.5, null, chipMaterial);


                let faceUV = new Array(6);
                for (let i = 0; i < 6; i++) {
                    faceUV[i] = BABYLON.Vector4.Zero();
                }
                faceUV[4] = new BABYLON.Vector4(0, 0, 1, 1);

                baseMesh.material = this.Material;

                getCube(0.25, 0.15, 0.35, 0.1, 0.025, 0.075, baseMesh, copper);
                getCube(0.45, 0.15, 0.35, 0.1, 0.025, 0.075, baseMesh, copper);
                getCube(0.65, 0.15, 0.35, 0.1, 0.025, 0.075, baseMesh, copper);
                getCube(0.25, 0.15, 0.575, 0.1, 0.025, 0.075, baseMesh, copper);
                getCube(0.45, 0.15, 0.575, 0.1, 0.025, 0.075, baseMesh, copper);
                getCube(0.65, 0.15, 0.575, 0.1, 0.025, 0.075, baseMesh, copper);

                baseMesh.position = this.position;
                this.baseMesh = baseMesh;

            }


        }
    }
}


//box, starts at (-0.5,0,0.5)
function getCube(x, y, z, w, h, d, parent = null, material = null, faceUV = undefined) {
    let c = BABYLON.MeshBuilder.CreateBox("box", {width: w, height: h, depth: d, faceUV: faceUV}, scene);
    c.position = new BABYLON.Vector3(x - 0.5 + w / 2, y + h / 2, -z + 0.5 - d / 2);
    if (parent != null) {
        c.parent = parent;
    }
    if (material != null) {
        c.material = material;
    }
    c.bakeCurrentTransformIntoVertices();

    return c;
}


class ChipXOR extends Chip {
    get Material() {
        let t = new BABYLON.StandardMaterial("", scene);
        let tx = new BABYLON.Texture("assets/xor.png", scene);
        tx.wAng = Math.PI / 2;
        t.diffuseTexture = tx;
        return t;
    }

    Eval(A, B) {
        return (A ^ B) & 1;
    }

    get Name() {
        return "XOR";
    }
}

class ChipAND extends Chip {
    get Material() {
        let t = new BABYLON.StandardMaterial("", scene);
        let tx = new BABYLON.Texture("assets/and.png", scene);
        tx.wAng = Math.PI / 2;
        t.diffuseTexture = tx;
        return t;
    }

    Eval(A, B) {
        return (A & B) & 1;
    }

    get Name() {
        return "AND";
    }
}

class ChipOR extends Chip {
    get Material() {
        let t = new BABYLON.StandardMaterial("", scene);
        let tx = new BABYLON.Texture("assets/or.png", scene);
        tx.wAng = Math.PI / 2;
        t.diffuseTexture = tx;
        return t;
    }

    Eval(A, B) {
        return (A | B) & 1;
    }

    get Name() {
        return "OR";
    }
}


class Timer extends ManagedElement {
    onUpdateObjectModel() {
    }

    onUpdateObjectView() {
    }

    get currentTime() {
        let t = new Date().getTime();
        if (this._startTime == null) {
            this._startTime = t;
        }
        return t - this._startTime;
    }
}

class Door extends CircuitElement {
    get angle() {
        if (this._ang == null) {
            this._ang = 0;
        }
        return this._ang;
    }

    set angle(val) {
        this._ang = val;
    }

    get timeSinceRefresh() {
        if (this._lastRefresh == null) {
            this._lastRefresh = timer.currentTime;
        }
        let t = timer.currentTime;
        let d = t - this._lastRefresh;
        this._lastRefresh = t;
        return d;
    }

    onUpdateObjectModel() {
        this.status = this.input.status;
    }

    onUpdateObjectView() {
        if(this.hasChanged()){
            this._lastRefresh = timer.currentTime;
        }

        if (this.baseMesh == null) {
            let baseMesh = getCube(0.5, 0, 0.35, 2, 3, 0.3, null, doorMaterial);
            getCube(2, 1.5, 0.30, 0.21, 0.1, 0.4, baseMesh);
            baseMesh.position = this.position;
            this.baseMesh = baseMesh;
        }

        if (this.status == 0) {
            if (this.angle > 0) {
                this.angle = this.angle - Math.max(this.timeSinceRefresh / 200, Math.PI / 180);
                if (this.angle < 0) this.angle = 0;
                this.baseMesh.rotation.y = this.angle;
            }
        } else if (this.status == 1) {
            if (this.angle < 1.4) {
                this.angle = this.angle + Math.max(this.timeSinceRefresh / 200, Math.PI / 180);
                if (this.angle > 1.4) this.angle = 1.4;
                this.baseMesh.rotation.y = this.angle;
            }

        }
    }
}