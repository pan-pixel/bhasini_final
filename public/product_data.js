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

        document.getElementById('addToCart').onclick = () => addToCart(index, 1);

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
