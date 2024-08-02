
(function () {
 const url =  window.location.href

 let idFromUrl = url.substring(58, url.length);
 let newSection = document.createElement("p");
 newSection.innerText = url;

 let he = document.createElement("h1");
 he.innerText = idFromUrl;

 const v = document.getElementById("PageInfo");
 v.appendChild(newSection);
 v.appendChild(he);

 getRecipeById(idFromUrl);
})();

function getRecipeById(id){

    const APIKEY = "47d8f549f16143e39ae9fc5106692b69";
    console.log(":"+id+";");
    var xhr2 = new XMLHttpRequest();
    xhr2.onreadystatechange = function() {
        if (xhr2.readyState === 4 && xhr2.status === 200) {
            const data2 = JSON.parse(xhr2.responseText);
            createRecipe(data2);
        } else if (xhr2.readyState === 4 && xhr2.status != 200) {
            console.error('Error:', xhr2.status, xhr2.statusText);

        }
    }
}
    xhr2.open('GET', `https://api.spoonacular.com/recipes/${id}/information?apiKey=${APIKEY}`, true); // true for async request
    xhr2.send();
}

function createRecipe(data2){
    for (item of data2[0]) {

        let newDiv = document.createElement("div");
        let par = document.createElement("p");
        par.innerText = data2.join();
        newDiv.appendChild(par);

        const divInfo = document.getElementById("PageInfo");
        divInfo.appendChild(newDiv);
    }
}
