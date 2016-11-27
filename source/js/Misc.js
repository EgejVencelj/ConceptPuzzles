var consoleText = [];

function rgb(r,g,b){
    return new BABYLON.Color3(r/255, g/255, b/255)
}

function println(text, color=null) {
    let noelems = 25;

    if(console != null){
        text = '<span style="color: ' + color + '">' + text + '</span>';
    }
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