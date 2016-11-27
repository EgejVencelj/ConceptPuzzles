"use strict";
var x1, x2, x3;


function initPuzzles(scene){
   /*let switch1 = new Switch({
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
    switch1.updateObjectView();*/
    
    let sx = 10;
    let sz = 0;
    
    x1 = new Switch({
        scene,
        position:new BABYLON.Vector3(sx, 0, sz)
    });
    
    let or1 = x1.chain(
        new Wire({scene,
            position:[new BABYLON.Vector3(sx, 0, sz), new BABYLON.Vector3(sx+2, 0, sz)]})
        ).chain(
        new Wire({scene,
            position:[new BABYLON.Vector3(sx+2, 0, 0), new BABYLON.Vector3(sx+2, 0, sz+1)]})
        ).chain(//Tukaj je OR switch
        new Light({scene,
            position:new BABYLON.Vector3(sx+2, 0, sz+1)})
        );
        
    or1.chain(
        new Wire({scene,
            position:[new BABYLON.Vector3(sx+2, 0, sz+1), new BABYLON.Vector3(sx+6, 0, sz+1)]})
        ).chain(//Output 1
        new Light({scene,
            position:new BABYLON.Vector3(sx+6, 0, sz+1)})
    );
    
    or1.chain(
        new Wire({scene,
            position:[new BABYLON.Vector3(sx+4, 0, sz+1), new BABYLON.Vector3(sx+4, 0, sz+4)]})
    );
    
    
    x2 = new Switch({
        scene,
        position:new BABYLON.Vector3(sx, 0, sz+2)
    });
    let buff = x2.chain(new Wire({scene,
            position:[new BABYLON.Vector3(sx, 0, sz+2), new BABYLON.Vector3(sx+2, 0, sz+2)]})
        );
    
    buff.chain(
        new Wire({scene,
            position:[new BABYLON.Vector3(sx+2, 0, sz+2), new BABYLON.Vector3(sx+2, 0, sz+1)]})
        );
    buff.chain(
        new Wire({scene,
            position:[new BABYLON.Vector3(sx+2, 0, sz+2), new BABYLON.Vector3(sx+2, 0, sz+4)]})
        ).chain(//Tukaj je XOR switch
        new Light({scene,
            position:new BABYLON.Vector3(sx+2, 0, sz+4)})
        ).chain(
        new Wire({scene,
            position:[new BABYLON.Vector3(sx+2, 0, sz+4), new BABYLON.Vector3(sx+6, 0, sz+4)]})
        ).chain(//Output 2
        new Light({
            position:new BABYLON.Vector3(sx+6, 0, sz+4)})
        );
    
    
    x3 = new Switch({
        scene,
        position:new BABYLON.Vector3(sx, 0, sz+4)
    });
    
    x3.chain(
        new Wire({scene,
            position:[new BABYLON.Vector3(sx, 0, sz+4), new BABYLON.Vector3(sx+2, 0, sz+4)]})
        ).chain(
        new Wire({scene,
            position:[new BABYLON.Vector3(sx+2, 0, sz+4), new BABYLON.Vector3(sx+2, 0, sz+4)]})    
        );
        
    x3.chain(
        new Wire({scene,
            position:[new BABYLON.Vector3(sx+2, 0, sz+4), new BABYLON.Vector3(sx+4, 0, sz+4)]})
    ).chain(
        new Light({
            position:new BABYLON.Vector3(sx+4, 0, sz+4)})
    ).chain(
        new Wire({scene,
            position:[new BABYLON.Vector3(sx+4, 0, sz+4), new BABYLON.Vector3(sx+6, 0, sz+4)]})
    ).chain(
        new Light({
            position:new BABYLON.Vector3(sx+6, 0, sz+4)})
    );
    
    
    x1.flick();
    x1.updateObjectModel();
    x1.updateObjectView();
    
    x2.flick();
    x2.updateObjectModel();
    x2.updateObjectView();
    
    x3.flick();
    x3.updateObjectModel();
    x3.updateObjectView();
    

}

