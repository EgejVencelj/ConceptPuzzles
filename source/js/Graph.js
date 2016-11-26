"use strict";
class ManagedElement{

    constructor(a) {
        Object.assign(this,a); //ha
    }

    update(){
        this.updateObjectModel();
        this.updateObjectView();
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
        if(this._statusOld != status){
            this._statusOld = status;
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
        println("flicked");

        if(this.hasChanged() || this.baseMesh == null){
            if(this.baseMesh == null){
                //let baseMesh = BABYLON.Mesh.CreateBox("box", 1.0, scene);
                let baseMesh = BABYLON.MeshBuilder.CreateBox("box", {
                    height:0.1,
                    //color: rgb(100, 27, 27),
                }, scene);

                baseMesh.diffuseColor = new BABYLON.Color3(1, 0, 0); //Red
                baseMesh.alpha = 0.3;

                baseMesh.position.x = 5;
                baseMesh.position.y = 0.05;


                let switchMesh = BABYLON.MeshBuilder.CreateBox("box", {width:0.1, depth:0.1, height:0.7}, scene);
                switchMesh.position.y = 0.35;
                switchMesh.bakeCurrentTransformIntoVertices();

                if(this.status == 0) {
                    switchMesh.rotation.z = Math.PI / 6;
                } else if(this.status == 1) {
                    switchMesh.rotation.z = -Math.PI/6;
                }


                switchMesh.parent = baseMesh;

                this.baseMesh = baseMesh;
                this.switchMesh = switchMesh
            }

        }
    }
}

class Wire extends CircuitElement{
    onUpdateObjectModel(){
        this.status = this.input.status;
    }
    onUpdateObjectView(){

    }
}

class Light extends CircuitElement{
    onUpdateObjectModel(){
        this.status = this.input.status;
    }
    onUpdateObjectView(){

    }
}