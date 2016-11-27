"use strict";

let standardBaseMaterial;

let wireOnMaterial, wireOffMaterial, wireDisMaterial;
let lightBulbColor, lightBulbOnMaterial, lightBulbOffMaterial, lightBulbBurnerOnMaterial, lightBulbBurnerOffMaterial;
let chipMaterial, copper;

function initGraphConstants(){
    standardBaseMaterial = new BABYLON.StandardMaterial("", scene);
    standardBaseMaterial.diffuseColor = rgb(100, 27, 27);


    wireOnMaterial = new BABYLON.StandardMaterial("", scene);
    wireOnMaterial.diffuseColor = rgb(17, 108, 255);
    wireOffMaterial=new BABYLON.StandardMaterial("", scene)
    wireOffMaterial.diffuseColor =rgb(4, 50, 124);
    wireDisMaterial=new BABYLON.StandardMaterial("", scene)
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

    let chipMaterial = new BABYLON.StandardMaterial("", scene);
    chipMaterial.diffuseColor = rgb(40, 40, 40);

    let copper = new BABYLON.StandardMaterial("", scene);
    copper.diffuseColor = rgb(233, 137, 41);
}


class ManagedElement{

    constructor(a) {
        this.output = [];
        Object.assign(this,a); //ha
    }

    update(){
        this.updateObjectModel();
        this.updateObjectView();
    }


    chain(element, inputSlot=null){
        this.output.push(element);
        if(inputSlot != null){
            element[inputSlot]=this;
        } else {
            element.input=this;
        }
        return element;
    }


    //fires object updating even on itself and on its children
    updateObjectModel(){
        if(this.onUpdateObjectModel != null) {
            this.onUpdateObjectModel();
        }
        for(let o of this._getOutputs()){
            if(o.updateObjectModel != null) {
                o.updateObjectModel();
            } else if(o.onUpdateObjectModel != null){
                o.onUpdateObjectModel();
            }
        }
    }

    updateObjectView(){
        if(this.onUpdateObjectView != null) {
            this.onUpdateObjectView();
        }
        for(let o of this._getOutputs()){
            if(o.updateObjectView != null) {
                o.updateObjectView();
            } else if(o.onUpdateObjectView != null){
                o.onUpdateObjectView();
            }
        }
    }

    //refereces for change propagation tree
    _getOutputs(){
        if(this.output instanceof Array){
            return this.output;
        } else if (this.output != null){
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
    set status(val){
        this._status = val;
    }

    hasChanged(){
        if(this._statusOld != this.status){
            this._statusOld = this.status;
            return true;
        }
        return false;
    }
}


class Switch extends CircuitElement{
    flick(){
        this.status = (~this.status)&1;
    }
    onUpdateObjectModel(){
    }
    onUpdateObjectView(){
        if(this.hasChanged() || this.baseMesh == null){
            if(this.baseMesh == null){
                let baseMesh = BABYLON.MeshBuilder.CreateBox("box", {height:0.1}, scene);
                baseMesh.material = standardBaseMaterial;
                baseMesh.position.y = 0.05;
                baseMesh.bakeCurrentTransformIntoVertices();

                let switchMesh = BABYLON.MeshBuilder.CreateBox("box", {width:0.1, depth:0.1, height:0.7}, scene);
                switchMesh.position.y = 0.35;
                switchMesh.bakeCurrentTransformIntoVertices();

                switchMesh.parent = baseMesh;

                baseMesh.position = this.position;

                this.baseMesh = baseMesh;
                this.switchMesh = switchMesh
            }

            if(this.status === 0) {
                this.switchMesh.rotation.z = Math.PI / 6;
            } else if(this.status === 1) {
               this.switchMesh.rotation.z = -Math.PI/6;
            } else {
               this.switchMesh.rotation.z = 0;
            }


        }
    }
}


class Wire extends CircuitElement{

    onUpdateObjectModel(){
        this.status = this.input.status;
    }
    onUpdateObjectView(){
        if(this.hasChanged() || this.baseMesh == null){
            if(this.baseMesh == null){

                let w = this.position[1].x - this.position[0].x;
                let h = this.position[1].y - this.position[0].y;
                let d = this.position[1].z - this.position[0].z;

                let l = Math.sqrt(w*w+h*h+d*d);

                var c = BABYLON.Mesh.CreateCylinder("", l, 0.1, 0.1, 8, 1, scene, false);
                c.position = new BABYLON.Vector3(l/2,0,0);
                c.rotation.z = Math.PI / 2;
                c.bakeCurrentTransformIntoVertices();
                c.rotation.z = Math.atan2(h, Math.sqrt(w*w+d*d));
                c.rotation.y = Math.atan2(-d, w);
                c.position = this.position[0];

                this.baseMesh = c;
                this.switchMesh = c
            }

            if(this.status === 0) {
                this.baseMesh.material = wireOffMaterial;
            } else if(this.status === 1) {
                this.baseMesh.material = wireOnMaterial;
            } else {
                this.baseMesh.material = wireDisMaterial;
            }

        }
    }
}

class Light extends CircuitElement{
    onUpdateObjectModel(){
        this.status = this.input.status;
    }
    onUpdateObjectView(){
        if(this.hasChanged() || this.baseMesh == null){
            if(this.baseMesh == null){
                let baseMesh = BABYLON.MeshBuilder.CreateBox("box", {height:0.1}, scene);
                baseMesh.material = standardBaseMaterial;
                baseMesh.position.y = 0.05;
                baseMesh.bakeCurrentTransformIntoVertices();


                let bulb = BABYLON.Mesh.CreateSphere("", 10.0, 0.5, scene);
                bulb.scaling.y=2;
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

            if(this.status === 0) {
                this.light.setEnabled(false)
                this.bulb.material = lightBulbOffMaterial;
                this.bulbBurner.material = lightBulbBurnerOffMaterial;

            } else if(this.status === 1) {
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
    constructor(event){
        this.event = event;
        this.fired = false;
    }

    onUpdateObjectModel(){
        this.status = this.input.status;
        if(this.status && !this.fired){
            this.fired = true;
            this.event();
        }
    }
}

class Socket extends CircuitElement{

    onUpdateObjectModel(){
        let A,B,C;
        if(this.inputA == null){
            A = 2;
        } else {
            A = this.inputA.status;
        }
        if(this.inputB == null){
            B = 2;
        } else {
            B = this.inputB.status;
        }

        if(A == 2 || B == 2){
            C = 2;
        } else {
            C = (A^B)&1; //xor; should be later hooked to chip object
        }

        this.status = C;1
    }
    onUpdateObjectView(){
        if(this.hasChanged() || this.baseMesh == null){
            if(this.baseMesh == null){

                let baseMesh = getCube(0,0,0,1,0.1,1, null, standardBaseMaterial);
                //let baseMesh = getCube(0,0,0,1,0.1,1, null, standardBaseMaterial);
                //baseMesh.position.y = 0.05;
                baseMesh.bakeCurrentTransformIntoVertices();



                //println("ga")


                baseMesh.position = this.position;
                this.baseMesh = baseMesh;

            }

            if(this.status === 0) {
                this.baseMesh.material = wireOffMaterial;
            } else if(this.status === 1) {
                this.baseMesh.material = wireOnMaterial;
            } else {
                this.baseMesh.material = wireDisMaterial;
            }

        }
    }
}

//box, starts at (-0.5,0,0.5)
function getCube(x,y,z, w, h, d, parent=null, material=null){
    let c = BABYLON.MeshBuilder.CreateBox("box", {width:w, height:h, depth:d}, scene);
    c.position = new BABYLON.Vector3(x-0.5+w/2,y+h/2,z-0.5+d/2);
    c.bakeCurrentTransformIntoVertices();
    if(parent != null){
        c.parent = parent;
    }
    if(material != null){
        c.material = material;
    }

    return c;
}

