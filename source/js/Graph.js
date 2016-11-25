class ManagedElement{

    constructor(a) {
        Object.assign(this,a); //ha
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
            return null;
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
}


class Switch extends CircuitElement{
    flick(){
        return (~this.status)&1;
    }
    onUpdateObjectModel(){
        document.writeln("switch");
    }
}

class Wire extends CircuitElement{
    onUpdateObjectModel(){
        this.status = this.input.status;
        document.writeln("wire");
    }
}

class Light extends CircuitElement{
    onUpdateObjectModel(){
        this.status = this.input.status;
        document.writeln("light");
    }
}