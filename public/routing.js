const buyNowButtons = document.querySelectorAll('.buy-now-button');
    buyNowButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            // event.preventDefault(); // Prevent default behavior of anchor tag
            const id = parseInt(button.getAttribute('id')); // Get id attribute as integer
            if(id == 0){
                var index = 0;
                localStorage.setItem('selectedIndex', index);
            }
            else{
                var index = id - 1; // Calculate index (assuming ids start from 1)
                localStorage.setItem('selectedIndex', index);  
            }
            // Pass the index value to another JavaScript file or perform any other action
            // For example, if you want to call a function from another JavaScript file:
            // anotherJavaScriptFile.someFunction(index);
            console.log('Index of clicked card:', index);

        });
    });


document.addEventListener('DOMContentLoaded', function() {
    const elementsToTranslate = document.querySelectorAll('.langChange');
    localStorage.setItem('language', 'en');
        
    let texts = [];
    elementsToTranslate.forEach(element => {
        texts.push(element.textContent.trim());
    });
    document.getElementById('language-selector').addEventListener('change', async function() {
        const elementsToTranslate = document.querySelectorAll('.langChange');
        var selectedLanguage = this.value;
        console.log('Selected language:', selectedLanguage);
        localStorage.setItem("language", selectedLanguage);
        if(selectedLanguage == "en"){
            elementsToTranslate.forEach((element, index) => {
                element.textContent = texts[index];
            });
        }
        else {
            try {
                const translatedTexts = await fetchTranslation(texts, selectedLanguage);
    
                elementsToTranslate.forEach((element, index) => {
                    element.textContent = translatedTexts[index];
                });
            } catch (error) {
                console.error('Error translating text:', error);
            }
        }
    
    });

});

    async function fetchTranslation(texts, targetLanguage) {
        const apiUrl = "http://127.0.0.1:5000/processContent";
        const content = {
            texts: texts,
            lang: targetLanguage
        };

        return new Promise((resolve, reject) => {
            fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(content),
            }).then((response) => {
                if(!response.ok) {
                    throw new Error("Failed to call text API");
                }
                return response.json();
            }).then((responseData) => {
                var ans = responseData["res"];
                console.log("API Text Response: ", responseData);
                resolve(ans);
            }).catch((error) => {
                console.log("Error calling Text API : ", error);
                reject(error);
            });
        });
    };