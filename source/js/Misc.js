var consoleText = [];

function rgb(r,g,b){
    return BABYLON.Color3(r/255, g/255, b/255)
}

function println(text) {
    let noelems = 25;

    consoleText.push(text);

    if(consoleText.length > noelems){
        for(let i=0; i < noelems;i++){
            consoleText[i]  = consoleText[i+1];
        }
        consoleText.pop();
    }

    let tb ="";
    for (let l of consoleText){
        tb += l + "<br/>";
    }

    document.getElementById("messages").innerHTML = tb;

}