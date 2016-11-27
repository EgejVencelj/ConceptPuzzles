"use strict";
var switchA;


function initPuzzles(scene){
   let switch1 = new Switch({
        scene,
        position:new BABYLON.Vector3(5, 0, 0)
    });

   switch1.chain(
       new Wire({scene,
       position:[new BABYLON.Vector3(5, 0, 0), new BABYLON.Vector3(7, 0, 1)],
       input:switch1})
   ).chain(
       new Light({
       scene,
       position:new BABYLON.Vector3(7, 0, 1)})
   );

    switch1.chain(
        new Wire({scene,
            position:[new BABYLON.Vector3(5, 0, 0), new BABYLON.Vector3(8, 0, -2)],
            input:switch1})
    ).chain(
        new Light({
            scene,
            position:new BABYLON.Vector3(8, 0, -2)})
    ).chain(
        new Socket({
            scene,
            position:new BABYLON.Vector3(6, 0, 0)})

    );



    

    switchA = switch1;

    //switch1.flick();
    switch1.updateObjectModel();
    switch1.updateObjectView();

}

