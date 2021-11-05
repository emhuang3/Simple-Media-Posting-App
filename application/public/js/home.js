var photoNum;

function fadeOut(innerGrid) {
        var gridOpacity = 1;  
        var timer = setInterval(function () {
        if (gridOpacity <= 0){
            clearInterval(timer);
        }
        innerGrid.style.opacity = gridOpacity;
        
        gridOpacity -= gridOpacity * 0.1;
    }, 35); 
    
}




function createPhotoCard(data, containerDiv){

//create a div tag
let innerGrid = document.createElement("div");
innerGrid.id = "photo-" + data.id;
//create img tag
let image = document.createElement("img");
image.src = data.url;
image.width = "300";
image.height = "300";
//create title tag
let title = document.createElement("h3");
title.innerText = data.title;
//add img to div
let updateInnerGrid = innerGrid.appendChild(image);
//add title to div
let addTitleTag = innerGrid.appendChild(title);
//add div to container div
let updateGrid = containerDiv.appendChild(innerGrid);

innerGrid.addEventListener("click", (e)=>{
    console.log(innerGrid.id);
    var selectedGrid = document.getElementById(innerGrid.id);


    fadeOut(selectedGrid);

    setTimeout(()=>{
        selectedGrid.parentNode.removeChild(selectedGrid);
    },1000)
 
    photoNum--;
    document.getElementById("items-count").innerHTML = `There are ${photoNum} photo(s) being shown`;
    
    
});






}

let mainDiv = document.getElementById("container");

if(mainDiv){
    let fetchURL = "https:jsonplaceholder.typicode.com/albums/2/photos"
    fetch(fetchURL)
    .then((data) => data.json())
    .then((photos)=> {
        let innerHTML = "";
        photoNum = photos.length;
        photos.forEach((photo) =>{
            createPhotoCard(photo, mainDiv);
          
        });
      

        document.getElementById("items-count").innerHTML = `There are ${photoNum} photo(s) being shown`;
    })
}