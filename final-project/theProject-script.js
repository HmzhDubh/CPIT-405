// Select menu and navbar elements
let menu = document.querySelector('#menu-bar');
let navbar = document.querySelector('.navigator');

// Toggle menu and navbar visibility when menu is clicked
menu.onclick = () => {
  menu.classList.toggle('fa-times');
  navbar.classList.toggle('active');
}

// Handle scroll events
window.onscroll = () => {
  // Hide menu and navbar when scrolling
  menu.classList.remove('fa-times');
  navbar.classList.remove('active');

  // Show or hide scroll-to-top button based on scroll position
  if(window.scrollY > 60){
    document.querySelector('#scroll-top').classList.add('active');
  } else {
    document.querySelector('#scroll-top').classList.remove('active');
  }
}

// Function to add fade-out effect to loader
function loader(){
  document.querySelector('.loader-container').classList.add('fade-out');
}

// Function to trigger loader fade-out effect
function fadeOut(){
  setInterval(loader, 1000);
}

// Call fadeOut function when window loads
window.onload = fadeOut();

// Main functionality when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed");

    // Get the element to display total price
    const outputPrice = document.getElementById('outputPrice');

    let currentValue = 0;

    // Function to update and display the total price
    function updatePrice(amount) {
        currentValue += amount;
        console.log("Current value updated to:", currentValue);
        outputPrice.textContent = "Total price: " + currentValue + " SR";
        console.log("Price display updated");
    }

    // Add click event listeners to all price buttons
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

    // Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyAIctYvepVDKAyZrUpAc76qEkTfx8WaNBQ",
        authDomain: "m3h-restaurant.firebaseapp.com",
        databaseURL: "https://m3h-restaurant-default-rtdb.firebaseio.com",
        projectId: "m3h-restaurant",
        storageBucket: "m3h-restaurant.appspot.com",
        messagingSenderId: "164803237196",
        appId: "1:164803237196:web:5c6bdaf13c585ced216be9"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // Get a reference to the database
    var formDB = firebase.database().ref('M3H-restaurantForm');

    // Add submit event listener to the form
    document.getElementById("projForm").addEventListener("submit", submitForm)

    // Function to handle form submission
    function submitForm(e){
        e.preventDefault();
        // Get form input values
        var firstName = document.getElementById('fname').value;
        var lastName = document.getElementById('lname').value;
        var phone = document.getElementById('phone').value;
        var email = document.getElementById('email').value;
        var address = document.getElementById('address').value;
        var priceString = document.getElementById('outputPrice').innerText;
        var price = priceString.substring(12, 15);

        // Validate form inputs
        if(firstName == "" || lastName == "" || phone == ""|| email == ""|| address == ""|| price==""){
            // Display error message if any field is empty
            const alert = document.getElementById('msg');
            alert.style.display = "block";
            let text = 'Please Enter All data correctly';
            alert.innerText = text;
            // Remove error message after 3 seconds
            setTimeout(() => {
                alert.style.display = "none";
            }, 3000);
        } else {
            // Save data to Firebase if all fields are filled
            saveData(firstName, lastName, phone, email, address, price);
            // Show success message
            const alert = document.querySelector('.alert');
            alert.style.display = "block";
            let text = 'Your order is successfully submitted ✅';
            alert.innerText = text;
            // Remove success message after 3 seconds
            setTimeout(() => {
                alert.style.display = "none";
            }, 3000);
            // Reset the form
            document.getElementById("projForm").reset();
        }
    }

    // Function to save form data to Firebase
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

    // Add click event listener to reset button
    const resetButton = document.getElementById('re');
    if (resetButton) {
        resetButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("Reset button clicked");
            // Reset total price to zero
            currentValue = 0;
            outputPrice.textContent = "Total price: " + currentValue + " SR";
            // Hide any visible alert
            const alert = document.querySelector('.alert');
            alert.style.display = "none";
        });
    } else {
        console.log("Reset button not found");
    }
});