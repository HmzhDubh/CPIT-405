const searchResults = document.getElementById("searchResults");
// Put Your API Key that you created in spoonacular Dashboard
const APIKEY = "your_api_key";

// send an HTTP request using XMLHttpRequest
function searchUsingXHR() {
    let keyword = document.getElementById("keyword").value;
    searchResults.innerHTML = "";
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            createDOMElements(data);
            console.log(data);
        } else if (xhr.readyState === 4 && xhr.status != 200) {

            console.error('Error:', xhr.status, xhr.statusText);
        }
    }
    xhr.open('GET', `https://api.spoonacular.com/recipes/complexSearch?query=${keyword}&apiKey=${APIKEY}`, true); // true for async request
    xhr.send();
}

// create DOM elements based on the response data
function createDOMElements(data) {
    for (item of data.results) {

        if (item.imageType === "jpg") {

            let imgDiv = document.createElement("div");
            let imgElem = document.createElement("img");
            let imgA = document.createElement("a");


            imgDiv.class = "recipe-item";
            imgElem.src = item.image;
            var itemId = item.id;
            imgA.innerText = item.title;
            imgA.href = `./lab-9-about.html?id=${itemId}`;
            imgA.id = itemId;

            imgDiv.appendChild(imgElem);
            imgDiv.appendChild(imgA);
            searchResults.appendChild(imgDiv);

        } else {
            alert("Type Not supported yet");
        }
    }
}
