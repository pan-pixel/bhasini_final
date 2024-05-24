export async function renderCartPage() {
    try {
        const response = await fetch('./products.json');
        if (!response.ok) {
            throw new Error(`Failed to load data. Status: ${response.status}`);
        }

        const productsData = await response.json();
        const products = productsData.products;
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        var cart_total = 0;
        const cartContainer = document.getElementById('cartContainer');
        cartContainer.innerHTML = ''; // Clear previous contents

        if (cart.length === 0) {
            cartContainer.innerText = 'Your cart is empty';
            return;
        }

        cart.forEach(item => {
            const product = products[item.index];
            cart_total = cart_total + (product.price * item.quantity)

            const productElement = document.createElement('div');
            productElement.className = 'cart-card flex';

            const leftCard = document.createElement('div');
            leftCard.className = 'left-cart-card';

            const rightCard = document.createElement('div');
            rightCard.className = 'right-cart-card flex';

            const cardInfo = document.createElement('div');
            cardInfo.className = 'cart-card-info';

            cardInfo.innerHTML = `
                <h3>${product.name}</h3>
                <p>Quantity: ${item.quantity}</p>
                <p>Total: ₹ ${product.price * item.quantity}</p>
            `;
            leftCard.innerHTML = `
                <img src="${product.image}">
            `;
            const productPriceHeading = document.createElement('h2');
            productPriceHeading.textContent = product.price;
            const crossCard = document.createElement('button');

            crossCard.innerHTML = `
            <h3 class="cross-card"><i class="fa-solid fa-trash"></i></h3>
            `;
            crossCard.onclick = () => removeFromCart(item.index);


            cartContainer.appendChild(productElement);
            productElement.appendChild(leftCard);
            productElement.appendChild(rightCard);
            productElement.appendChild(crossCard);
            rightCard.appendChild(cardInfo);
            rightCard.appendChild(productPriceHeading);
        });
    } catch (error) {
        console.error('Error rendering cart page:', error);
    }
    const cartTot = document.getElementById('cartTotal');
    cartTot.innerHTML = `
        <h2>Cart Total : ₹ ${cart_total}</h2>
    `;
}

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
};

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Filter out the item with the specified index
    cart = cart.filter(item => item.index !== index);

    // Update local storage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Re-render the cart page
    renderCartPage();
}

