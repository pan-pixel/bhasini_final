// import { loadModel } from "./3d.js";

const cont1 = document.getElementById('threeview');
const cont2 = document.getElementById('ar-screen');
const b1=document.getElementById('btn1');
const b2=document.getElementById('btn2');

cont1.classList.add("active");
b1.classList.add("active");

b1.addEventListener('click',()=>{
    cont1.classList.add("active")
    b1.classList.add("active");
    b2.classList.remove("active");
    cont2.classList.remove("active");
//   document.getElementById("ar-screen").style.display = "block";
    cont2.style.display = "none";

});
b2.addEventListener('click',()=>{
    cont2.classList.add("active")
    cont2.style.display = "block";
    b2.classList.add("active");
    b1.classList.remove("active");
    cont1.classList.remove("active");
});

export async function fetchTranslation(texts, targetLanguage) {
    const apiUrl = "https://backendserver-u4zv.onrender.com/processContent";
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

// document.addEventListener('DOMContentLoaded', async function(){
//     const elementsToTranslate = document.querySelectorAll('.langChange');
        
//     let texts = [];
//     elementsToTranslate.forEach(element => {
//         texts.push(element.textContent.trim());
//     });
//     var selectedLanguage = localStorage.getItem('language');
//     if(selectedLanguage !='en'){
//         try {
//             const translatedTexts = await fetchTranslation(texts, selectedLanguage);

//             elementsToTranslate.forEach((element, index) => {
//                 element.textContent = translatedTexts[index];
//             });
//         } catch (error) {
//             console.error('Error translating text:', error);
//         }
//     }
// })