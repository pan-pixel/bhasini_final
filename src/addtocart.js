export function addToCart(index, quantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if the item already exists in the cart
    let existingItem = cart.find(item => item.index === index);

    if (existingItem) {
        if(existingItem.quantity >5){
            existingItem.quantity = 0;
        }
        existingItem.quantity += quantity;
        console.log("increased");
    } else {
        cart.push({ index, quantity });
        console.log("added");

    }
    console.log(cart)
    localStorage.setItem('cart', JSON.stringify(cart));
    showSnackbar();
};

function showSnackbar() {
    // Get the snackbar DIV
    var snackbar = document.getElementById("snackbar");

    // Add the "show" class to DIV
    snackbar.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ snackbar.className = snackbar.className.replace("show", ""); }, 3000);
}