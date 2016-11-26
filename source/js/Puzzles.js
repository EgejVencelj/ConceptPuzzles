"use strict";
var switchA;


function initPuzzles(scene){
   let switch1 = new Switch({
        scene,
        position:BABYLON.Vector3(0, 0, 0)
    });

    let wire1 = new Wire({
        scene,
        position:[BABYLON.Vector3(0, 0, 0), BABYLON.Vector3(0, 0, 0)],
        input:switch1
    });
    switch1.output = wire1;

    let light1 = new Light({
        scene,
        position:BABYLON.Vector3(0, 0, 0),
        input:wire1
    });
    wire1.output = light1;
    

    switchA = switch1;

    switch1.flick();
    switch1.updateObjectModel();
    switch1.updateObjectView();

}

