import { loadModel } from "./3d.js";
import { fetchTranslation } from "./viewcontrol.js";
import { addToCart } from "./cart.js";

export async function fetchProductData(index) {
    try {
        const response = await fetch('./products.json');
        if (!response.ok) {
            throw new Error(`Failed to load data. Status: ${response.status}`);
        }

        const productsData = await response.json();
        const products = productsData.products;

        if (!products || products.length <= index) {
            throw new Error('Product index out of range.');
        }

        const product = products[index];

        // Display product information
        document.getElementById('productName').innerText = product.name;
        document.getElementById('productDescription').innerText = product.description;
        document.getElementById('productPrice').innerText = '₹' + product.price;
        loadModel(product.path);

        await translateTextElements();

        const addToCartButton = document.getElementById('addToCart');
        const cartIcon = addToCartButton.querySelector('i');
        const buttonText = addToCartButton.querySelector('.langChange');
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Check if the product is already in the cart
        const existingItem = cart.find(item => item.index === index);

        if (existingItem) {
            // Update button to indicate item is in the cart
            cartIcon.classList.remove('fa-cart-shopping');
            cartIcon.classList.add('fa-check');
            buttonText.innerText = 'Added to cart';
        } else {
            // Reset button to default state
            cartIcon.classList.remove('fa-check');
            cartIcon.classList.add('fa-cart-shopping');
            buttonText.innerText = 'Cart';
        }

        addToCartButton.onclick = () => {
            addToCart(index, 1);

            // Update button after adding to cart
            cartIcon.classList.remove('fa-cart-shopping');
            cartIcon.classList.add('fa-check');
            buttonText.innerText = 'Added to cart';
        };
        
    } catch (error) {
        console.error('Error fetching product data:', error);
    }
}

async function translateTextElements() {
    const elementsToTranslate = document.querySelectorAll('.langChange');
    const texts = Array.from(elementsToTranslate).map(element => element.textContent.trim());
    const selectedLanguage = localStorage.getItem('language');

    if (selectedLanguage && selectedLanguage !== 'en') {
        try {
            const translatedTexts = await fetchTranslation(texts, selectedLanguage);

            elementsToTranslate.forEach((element, index) => {
                element.textContent = translatedTexts[index];
            });
        } catch (error) {
            console.error('Error translating text:', error);
        }
    }
}
