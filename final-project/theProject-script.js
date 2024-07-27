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

    const resetButton = document.getElementById('re');
    if (resetButton) {
        resetButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("Reset button clicked");
            currentValue = 0;
            outputPrice.textContent = "Total price: " + currentValue + " SR";
        });
    } else {
        console.log("Reset button not found");
    }
});