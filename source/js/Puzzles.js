"use strict";
var x0, x1, x2, x3;


function initPuzzles(scene){
    println("Gamma: Hey there. I'm stuck in this chamber. Can you help me escape?", "green");
    println("*help the robot escape testing facilities*")
    println("*use W,S,A and D keys to move and click on objects to interact*","grey");

    initPuzzle1();

    /*let s = new Socket({position:new BABYLON.Vector3(4, 0, -5)});
    s.chain(new ChipAND({position:new BABYLON.Vector3(4, 0, -5)}));

    x1.chain(s, "inputA");
    x2.chain(s, "inputB");

    s.chain(new FireAlways((v)=>{
        println("socket "+v);
    }))


    let d = new Door({position:new BABYLON.Vector3(2, 0, 0)});
    s.chain(d);
    timer.chain(d);


    s.chain(new Light({position:new BABYLON.Vector3(4, 0, 6)}));*/
}


function initPuzzle1(){

    let sx = 5;
    let sz = 5;

    x0 = new Switch({position:new BABYLON.Vector3(sx, 0, sz)});
    let door = x0.chain(
        new Wire({
            position:[new BABYLON.Vector3(sx, 0, sz), new BABYLON.Vector3(sx+2, 0, sz)]
        })
    ).chain(
        new Light({
            position:new BABYLON.Vector3(sx+2, 0, sz)
        })
    ).chain(
        new Wire({
            position:[new BABYLON.Vector3(sx+2, 0, sz), new BABYLON.Vector3(sx+4, 0, sz)]
        })
    ).chain(
        new Wire({
            position:[new BABYLON.Vector3(sx+4, 0, sz), new BABYLON.Vector3(sx+4, 0, sz+1)]
        })
    ).chain(
        new Door({
            position:new BABYLON.Vector3(sx+4, 0, sz+1)
        })
    );

    door.chain(
        new FireOnce(()=>{
            println("Gamma: Can you turn on every light? I have a feeling this will help us somehow.", "green")
        })
    );

    timer.chain(door);

    x0.update();

    sx = 20;
    sz = 10;

    x1 = new Switch({position:new BABYLON.Vector3(sx, 0, sz)});
    x2 = new Switch({position:new BABYLON.Vector3(sx, 0, sz+2)});
    x3 = new Switch({position:new BABYLON.Vector3(sx, 0, sz+5)});


    let w1 = x1.chain(
        new Wire({position:[new BABYLON.Vector3(sx, 0, sz), new BABYLON.Vector3(sx+2, 0, sz)]})
    ).chain(
        new Wire({position:[new BABYLON.Vector3(sx+2, 0, sz), new BABYLON.Vector3(sx+2, 0, sz+1)]})
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


    let light1 = new Light({position:new BABYLON.Vector3(sx+6, 0, sz+1)});
    let w4 = or1.chain(
        new Wire({ position:[new BABYLON.Vector3(sx+2, 0, sz+1), new BABYLON.Vector3(sx+6, 0, sz+1)]})
    ).chain(light1);


    let xor1 = new Socket({position:new BABYLON.Vector3(sx+2, 0, sz+3)});
    xor1.chain(new ChipXOR());

    x2.chain(xor1, "inputA");
    x3.chain(xor1, "inputB");

    let light2 = new Light({position:new BABYLON.Vector3(sx+6, 0, sz+3)});
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
    ).chain(light3);

    x1.update();
    x2.update();
    x3.update();

    let m = new Multitool((a,b,c)=>{
        return a & b & c & 1
    });

    light1.chain(m,0); //javascript :D :S :D
    light2.chain(m,1);
    light3.chain(m,2);



    m.chain(new FireOnce(()=>{
        println("Robot: Wow, you've solved the first puzzle. ", "green");
        println("Fin. ");
    }));
}

