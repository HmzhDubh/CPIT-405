let menu = document.querySelector('#menu-bar');
let navbar = document.querySelector('.navigator');


menu.onclick = () =>{

  menu.classList.toggle('fa-times');
  navbar.classList.toggle('active');

}

window.onscroll = () =>{

  menu.classList.remove('fa-times');
  navbar.classList.remove('active');

  if(window.scrollY > 60){
    document.querySelector('#scroll-top').classList.add('active');
  }else{
    document.querySelector('#scroll-top').classList.remove('active');
  }

}

function loader(){
  document.querySelector('.loader-container').classList.add('fade-out');
}

function fadeOut(){
  setInterval(loader, 1000);
}

window.onload = fadeOut();

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed");

    const outputPrice = document.getElementById('outputPrice');
    console.log("outputPrice element:", outputPrice);

    let currentValue = 0;

    function updatePrice(amount) {
        currentValue += amount;
        console.log("Current value updated to:", currentValue);
        outputPrice.textContent = "Total price: " + currentValue + " SR";
        console.log("Price display updated");
    }

    const buttons = document.querySelectorAll('.btn[id^="pr"]');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("Button clicked:", this.id);
            switch(this.id) {
                case 'pr1': updatePrice(39); break;
                case 'pr2': updatePrice(45); break;
                case 'pr3': updatePrice(25); break;
                case 'pr4': updatePrice(15); break;
                case 'pr5': updatePrice(15); break;
                case 'pr6': updatePrice(16); break;
            }
        });
    });

 // Your web app's Firebase configuration
const firebaseConfig = {
apiKey: "AIzaSyAIctYvepVDKAyZrUpAc76qEkTfx8WaNBQ",
authDomain: "m3h-restaurant.firebaseapp.com",
databaseURL: "https://m3h-restaurant-default-rtdb.firebaseio.com",
projectId: "m3h-restaurant",
storageBucket: "m3h-restaurant.appspot.com",
messagingSenderId: "164803237196",
appId: "1:164803237196:web:5c6bdaf13c585ced216be9"
};

// init the firebase DB
firebase.initializeApp(firebaseConfig);

// reference the DB
var formDB = firebase.database().ref('M3H-restaurantForm');

document.getElementById("projForm").addEventListener("submit", submitForm)

function submitForm(e){
    e.preventDefault();
    var firstName = document.getElementById('fname').value;
    var lastName = document.getElementById('lname').value;
    var phone = document.getElementById('phone').value;
    var email = document.getElementById('email').value;
    var address = document.getElementById('address').value;
    var priceString = document.getElementById('outputPrice').innerText;
    var price = priceString.substring(12, 15);
    if(firstName == "" || lastName == "" || phone == ""|| email == ""|| address == ""|| price==""){
        const alert = document.getElementById('msg');
        alert.style.display = "block";
        // show error msg
        let text = 'Please Enter All data correctly';
        alert.innerText = text;
        //remove error msg
        setTimeout(() => {
            alert.style.display = "none";
        }, 3000);

    }
    else{
     saveData(firstName, lastName, phone, email, address, price);
     // show the Alert message
      const alert = document.querySelector('.alert');
      alert.style.display = "block";
      let text = 'Your order is successfully submitted ✅';
      alert.innerText = text;

      // Remove the message
      setTimeout(() => {
        alert.style.display = "none";
      }, 3000);
      // reset the form
      document.getElementById("projForm").reset();
    }
}

    const saveData = (firstName, lastName, phone, email, address, price) => {
        var newFormData = formDB.push();
        newFormData.set({
            fname: firstName,
            lname: lastName,
            phone: phone,
            email: email,
            address: address,
            price: price,
        });
    }

    const resetButton = document.getElementById('re');
    if (resetButton) {
        resetButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("Reset button clicked");
            currentValue = 0;
            outputPrice.textContent = "Total price: " + currentValue + " SR";
            const alert = document.querySelector('.alert');
            alert.style.display = "none";
        });
    } else {
        console.log("Reset button not found");
    }
});