
(function () {
    const url =  window.location.href
    let idFromUrl = url.substring((url.length - 6), url.length);
    getRecipeById(idFromUrl);
})();

function getRecipeById(id){

    const APIKEY = "47d8f549f16143e39ae9fc5106692b69";
    console.log(">>>"+id+";");
    var xhr2 = new XMLHttpRequest();
    xhr2.onreadystatechange = function() {
        if (xhr2.readyState === 4 && xhr2.status === 200) {
            const data = JSON.parse(xhr2.responseText);
            createRecipe(data);
        } else if (xhr2.readyState === 4 && xhr2.status != 200) {
            console.error('Error:', xhr2.status, xhr2.statusText);

        }
    }

    xhr2.open('GET', `https://api.spoonacular.com/recipes/${id}/information?apiKey=${APIKEY}`, true); // true for async request
    xhr2.send();
}

function createRecipe(data){

    console.log(data.extendedIngredients);

    const divInfo = document.getElementById("PageInfo");
    let newDiv = document.createElement("div");
    let par = document.createElement("p");

    for (item of data.extendedIngredients) {
        par.innerText += item.aisle + ","
    }
    newDiv.appendChild(par);
    divInfo.appendChild(newDiv);
}
