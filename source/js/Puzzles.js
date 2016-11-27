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

    puzzle1();

}


function puzzle1(){
    let sx = 10;
    let sz = 0;

    x1 = new Switch({position:new BABYLON.Vector3(sx, 0, sz)});
    x2 = new Switch({position:new BABYLON.Vector3(sx, 0, sz+2)});
    x3 = new Switch({position:new BABYLON.Vector3(sx, 0, sz+5)});


    let w1 = x1.chain(
        new Wire({position:[new BABYLON.Vector3(sx, 0, sz), new BABYLON.Vector3(sx+2, 0, sz)]})
    ).chain(
        new Wire({position:[new BABYLON.Vector3(sx+2, 0, 0), new BABYLON.Vector3(sx+2, 0, sz+1)]})
    );

    let w2 = x2.chain(
        new Wire({position:[new BABYLON.Vector3(sx, 0, sz+2), new BABYLON.Vector3(sx+2, 0, sz+2)]})
    ).chain(
        new Wire({position:[new BABYLON.Vector3(sx+2, 0, sz+1), new BABYLON.Vector3(sx+2, 0, sz+3)]})
    );

    let w3a = x3.chain(
        new Wire({position:[new BABYLON.Vector3(sx, 0, sz+5), new BABYLON.Vector3(sx+4, 0, sz+5)]})
    );
    let w3b = x3.chain(
        new Wire({position:[new BABYLON.Vector3(sx+2, 0, sz+5), new BABYLON.Vector3(sx+2, 0, sz+3)]})
    );

    let or1 = new Socket({position:new BABYLON.Vector3(sx+2, 0, sz+1),});
    or1.chain(new ChipOR());


    x1.chain(or1, "inputA");
    x2.chain(or1, "inputB");

    let light1 =  new Light({position:new BABYLON.Vector3(sx+6, 0, sz+1)});
    let w4 = or1.chain(
        new Wire({ position:[new BABYLON.Vector3(sx+2, 0, sz+1), new BABYLON.Vector3(sx+6, 0, sz+1)]})
    ).chain(
        light1
    );


    let xor1 = new Socket({position:new BABYLON.Vector3(sx+2, 0, sz+3)});
    xor1.chain(new ChipXOR());

    x2.chain(xor1, "inputA");
    x3.chain(xor1, "inputB");

    let light2 =  new Light({position:new BABYLON.Vector3(sx+6, 0, sz+3)});
    xor1.chain(
        new Wire({position:[new BABYLON.Vector3(sx+2, 0, sz+3), new BABYLON.Vector3(sx+6, 0, sz+3)]})
    ).chain(
        light2
    );

    let w5 = or1.chain(
        new Wire({position:[new BABYLON.Vector3(sx+4, 0, sz+1), new BABYLON.Vector3(sx+4, 0, sz+5)]})
    );

    let and1 = new Socket({position:new BABYLON.Vector3(sx+4, 0, sz+5)});
    and1.chain(new ChipAND());

    w3a.chain(and1, "inputA");
    w5.chain(and1, "inputB");

    let light3 = new Light({position:new BABYLON.Vector3(sx+6, 0, sz+5)});
    and1.chain(
        new Wire({position:[new BABYLON.Vector3(sx+4, 0, sz+5), new BABYLON.Vector3(sx+6, 0, sz+5)]})
    ).chain(
        light3
    );


    let m = new Multitool((a,b,c)=>{
        return a & b & c & 1
    });
    light1.chain(m,0); //javascript :D :S :D
    light2.chain(m,1);
    light3.chain(m,2);



    m.chain(new FireOnce(()=>{
        println("Robot: Wow, you've solved the first puzzle. ");
    }));

    let d = new Door({position:new BABYLON.Vector3(2, 0, 0)});1
    m.chain(d);
    timer.chain(d);

    x1.status = x2.status = x3.status = 0;

    x1.update();
    x2.update();
    x3.update();

}

