import * as deepar from "deepar";
import { scrollToNext ,scrollToPrevious, getCurrentIndex } from "./carousel";
import { startRecording, stopRecording } from "./voice_control";
import { currentlyRecording } from "./voice_control";
import { addToCart, showSnackbar } from "./addtocart";


console.log("Deepar version: " + deepar.version);
const prevButton = document.querySelector(".prev-btn");
const nextButton = document.querySelector(".next-btn");
const loadingSpinner = document.getElementById("load-spin");
let recorderButton = document.getElementById("recorder-button");
const selectedIndex = localStorage.getItem('selectedIndex');





// Top-level await is not supported.
// So we wrap the whole code in an async function that is called immediatly.
(async function () {
  // Get the element you want to place DeepAR into. DeepAR will inherit its width and height from this and fill it.
  const previewElement = document.getElementById("ar-screen");

  // trigger loading progress bar animation
  const loadingProgressBar = document.getElementById("loading-progress-bar");
  loadingProgressBar.style.width = "100%";

  // All the effects are in the public/effects folder.
  // Here we define the order of effect files.
  const effectList = [
    "effects/orange-turban.deepar",
    "effects/check_new.deepar",
    "effects/new_turban.deepar",
    "effects/specs4.deepar",
    "effects/gold_chain.deepar",
    "effects/ray-ban-wayfarer.deepar",
    "effects/Chashma.deepar",
    "effects/specs3.deepar",
    "effects/SimpleGlasses.deepar",
    // "effects/specs1.deepar",
    // "effects/specs2.deepar",
    // "effects/specs4.deepar",
  ];

  let deepAR = null;

  // Initialize DeepAR with an effect file.
  try {
    deepAR = await deepar.initialize({
      licenseKey: "066b47f0f3a12c596fc8f4eea876ececd8e42df08707ef8fb26866d75b96a9abc82972325bd376ca",
      previewElement,
      effect: effectList[0],
      // Removing the rootPath option will make DeepAR load the resources from the JSdelivr CDN,
      // which is fine for development but is not recommended for production since it's not optimized for performance and can be unstable.
      // More info here: https://docs.deepar.ai/deepar-sdk/platforms/web/tutorials/download-optimizations/#custom-deployment-of-deepar-web-resources
      rootPath: "./deepar-resources",
      additionalOptions: {
        cameraConfig: {
          // facingMode: 'environment'  // uncomment this line to use the rear camera
        },
      },
    });
  } catch (error) {
    console.error(error);
    document.getElementById("loading-screen").style.display = "none";
    return;
  }

  // var check = callAPI()

  // Hide the loading screen.
  document.getElementById("loading-screen").style.display = "none";
  // document.getElementById("ar-screen").style.display = "block";
  deepAR.switchEffect(effectList[selectedIndex]);

  window.effect = effectList[0];


  nextButton.addEventListener("click", async () => {
    const currentIndex = await scrollToNext() - 2;
    if(window.effect !== effectList[currentIndex]){
      loadingSpinner.style.display = "flex";
      await deepAR.switchEffect(effectList[currentIndex]);
      window.effect = effectList[currentIndex];
    }
    loadingSpinner.style.display = "none";

    console.log("Next - Current index:", currentIndex);
});

prevButton.addEventListener("click", async () => {
    const currentIndex = await scrollToPrevious() - 2;
    if(window.effect !== effectList[currentIndex]){
      loadingSpinner.style.display = "flex";
      await deepAR.switchEffect(effectList[currentIndex]);
      window.effect = effectList[currentIndex];
    }
    loadingSpinner.style.display = "none";

    console.log("Previous - Current index:", currentIndex);
});

recorderButton.addEventListener("mousedown", () => {
  //   holdTimer = setTimeout(startRecording, 100);
      // var output = startRecording()
      // console.log(output)
      startRecording()
      .then(async (answer) => {
        if(answer == "next"){
          console.log("Going next")
          const currentIndex = await scrollToNext() - 2;
          if(window.effect !== effectList[currentIndex]){
              loadingSpinner.style.display = "flex";
              await deepAR.switchEffect(effectList[currentIndex]);
              window.effect = effectList[currentIndex];
          }
          loadingSpinner.style.display = "none";

          console.log("Next - Current index:", currentIndex);
        }
        else if(answer == "previous"){
          console.log("Going to previous")
          const currentIndex = await scrollToPrevious() - 2;
          if(window.effect !== effectList[currentIndex]){
              loadingSpinner.style.display = "flex";
              await deepAR.switchEffect(effectList[currentIndex]);
              window.effect = effectList[currentIndex];
          }
          loadingSpinner.style.display = "none";
          console.log("Previous - Current index:", currentIndex);
        }
        else if(answer == "cart"){
          console.log("cart");
          const currentIndex = getCurrentIndex() - 2;
          console.log("index -> ",currentIndex);
          addToCart(currentIndex, 1);

        }
        else{
          console.log("Do nothing");
          const message = "Try again! Couldn't understand you."
          showSnackbar(message);
          
        }
      // Do something with the answer
    })
    .catch((error) => {
      console.error("Error:", error);
      // Handle the error
    });
  });
  
recorderButton.addEventListener("mouseup", () => {
  //   clearTimeout(holdTimer);
    if (currentlyRecording) {
      stopRecording();
    }
  });
  
  recorderButton.addEventListener("click", () => {
    if(currentlyRecording){
      stopRecording();
    }
  })
})();
