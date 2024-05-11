import { scrollToNext, scrollToPrevious, getCurrentIndex } from "./3dcarousel.js";
import { fetchProductData } from "./product_data.js";
// import { startRecording, stopRecording } from "./3dvoice_control.js";
// import { currentlyRecording } from "./3dvoice_control.js";

const prevButton = document.querySelector(".prev-btn");
const nextButton = document.querySelector(".next-btn");
// const recorderButton = document.getElementById("recorder-button");

let currentIndex = 0;
const selectedIndex = localStorage.getItem('selectedIndex');
console.log(selectedIndex)

fetchProductData(currentIndex)

for (let i = 0; i < selectedIndex; i++) {
    currentIndex = await scrollToNext() - 2;
    
}
fetchProductData(currentIndex)


nextButton.addEventListener("click", async () => {
    currentIndex = await scrollToNext() - 2;
    fetchProductData(currentIndex)
});

prevButton.addEventListener("click", async () => {
    currentIndex = await scrollToPrevious() - 2;
    fetchProductData(currentIndex)
});

// Function to monitor currentIndex using getCurrentIndex and trigger fetchProductData if it changes
function monitorCurrentIndex() {
  const newIndex = getCurrentIndex() - 2;
//   console.log("Check")
//   console.log(newIndex)
//   console.log(currentIndex)
  if (newIndex !== currentIndex) {
    currentIndex = newIndex;
    fetchProductData(currentIndex)
  }
}

// // Check currentIndex periodically and update fetchProductData if it changes
setInterval(monitorCurrentIndex, 1000); // Adjust the interval as needed
