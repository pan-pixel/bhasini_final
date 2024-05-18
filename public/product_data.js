import { loadModel } from "./3d.js";
import { fetchTranslation } from "./viewcontrol.js";
export function fetchProductData(index) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', './products.json', true);
  
    // Process the response
    xhr.onload = async function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        // Parse JSON data
        var productsData = JSON.parse(xhr.responseText);
        var products = productsData.products;
  
        // Accessing product by index
        var product = products[index]; // Adjust index since arrays are 0-indexed
  
        // Display product information
        document.getElementById('productName').innerText = product.name;
        document.getElementById('productDescription').innerText = product.description;
        document.getElementById('productPrice').innerText ='₹' + product.price;
        loadModel(product.path);

        const elementsToTranslate = document.querySelectorAll('.langChange');
        
        let texts = [];
        elementsToTranslate.forEach(element => {
            texts.push(element.textContent.trim());
        });
        var selectedLanguage = localStorage.getItem('language');
        if(selectedLanguage !='en'){
            try {
                const translatedTexts = await fetchTranslation(texts, selectedLanguage);

                elementsToTranslate.forEach((element, index) => {
                    element.textContent = translatedTexts[index];
                });
            } catch (error) {
                console.error('Error translating text:', error);
            }
        }

      } else {
        console.error('Failed to load data. Status:', xhr.status);
      }
    };

    xhr.send();
}

  
 
  