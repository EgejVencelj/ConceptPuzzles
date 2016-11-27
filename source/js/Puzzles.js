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
    
    x2 = new Switch({

        position:new BABYLON.Vector3(sx, 0, sz+2)
    });
    
    x3 = new Switch({
        scene,
        position:new BABYLON.Vector3(sx, 0, sz+5)
    });
    
    
    let w1 = x1.chain(
        new Wire({
            position:[new BABYLON.Vector3(sx, 0, sz), new BABYLON.Vector3(sx+2, 0, sz)]})
        ).chain(
        new Wire({
            position:[new BABYLON.Vector3(sx+2, 0, 0), new BABYLON.Vector3(sx+2, 0, sz+1)]})
        );
        
    let w2 = x2.chain(
        new Wire({
            position:[new BABYLON.Vector3(sx, 0, sz+2), new BABYLON.Vector3(sx+2, 0, sz+2)]})
        ).chain(
        new Wire({
            position:[new BABYLON.Vector3(sx+2, 0, sz+1), new BABYLON.Vector3(sx+2, 0, sz+3)]})
        );
        
    let w3a = x3.chain(
        new Wire({
            position:[new BABYLON.Vector3(sx, 0, sz+5), new BABYLON.Vector3(sx+4, 0, sz+5)]})
        );
    let w3b = x3.chain(
        new Wire({
            position:[new BABYLON.Vector3(sx+2, 0, sz+5), new BABYLON.Vector3(sx+2, 0, sz+3)]})
        );
        
    let or1 = new Socket({
        position:new BABYLON.Vector3(sx+2, 0, sz+1),
    });
    
    x1.chain(or1, "inputA");
    x2.chain(or1, "inputB");


    let w4 = or1.chain(
        new Wire({
            position:[new BABYLON.Vector3(sx+2, 0, sz+1), new BABYLON.Vector3(sx+6, 0, sz+1)]
        })
    ).chain(
        new Light({
            position:new BABYLON.Vector3(sx+6, 0, sz+1)
        })
    );


    let xor1 = new Socket({
        position:new BABYLON.Vector3(sx+2, 0, sz+3),
    });
    
    x2.chain(xor1, "inputA");
    x3.chain(xor1, "inputB");
    
    xor1.chain(
        new Wire({
            position:[new BABYLON.Vector3(sx+2, 0, sz+3), new BABYLON.Vector3(sx+6, 0, sz+3)]
        })
    ).chain(
        new Light({
            position:new BABYLON.Vector3(sx+6, 0, sz+3)
        })
    );
    
    let w5 = or1.chain(
        new Wire({
            position:[new BABYLON.Vector3(sx+4, 0, sz+1), new BABYLON.Vector3(sx+4, 0, sz+5)]
        })
    );
    
    let and1 = new Socket({
        position:new BABYLON.Vector3(sx+4, 0, sz+5)
    });
    
    w3a.chain(and1, "inputA");
    w5.chain(and1, "inputB");
    
    and1.chain(
        new Wire({
            position:[new BABYLON.Vector3(sx+4, 0, sz+5), new BABYLON.Vector3(sx+6, 0, sz+5)]
        })
    ).chain(
        new Light({
            position:new BABYLON.Vector3(sx+6, 0, sz+5)
        })
    );


    let s = new Socket({position:new BABYLON.Vector3(4, 0, 4)});

    x1.chain(s, "inputA");
    x2.chain(s, "inputB");

    s.chain(new FireAlways((v)=>{
        println("socket "+v);
    }))

    s.chain( new Light({ position:new BABYLON.Vector3(4, 0, 6)}));


    x1.update();
    x2.update();
    x3.update();



    

}

