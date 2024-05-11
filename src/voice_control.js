let recorderButton = document.getElementById("recorder-button");
let recorderButtonDiv = document.getElementById("recorder-button-div");
// let audioElement = document.getElementById("audio");
let webAudioRecorder;
export var currentlyRecording = false;
let getUserMediaStream;
let count = 0;

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64String = reader.result;
      resolve(base64String);
    };
    reader.onerror = reject;
  });
}

function speak(text){
  const utterance = new SpeechSynthesisUtterance(text);
  // utterance.rate = 1.8
  speechSynthesis.speak(utterance);
}

function callAPI(base64) {
    const apiUrl = "http://127.0.0.1:5000/processAudio";
    const data = {
      audio: base64,
    };
  
    // Return a promise
    return new Promise((resolve, reject) => {
      fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to call API");
          }
          return response.json();
        })
        .then((responseData) => {
          var text = responseData["res"];
          var answer = text;
          if (text == "next" || text == "previous") {
            text = "Going to the " + text + " page.";
            speak(text);
          } else if (text == "cart") {
            text = "Adding this to cart.";
            speak(text);
          } else {
            if (count < 1) {
              count++;
              speak("Couldn't understand you, try again!");
            } else {
              count = 0;
              speak("Couldn't understand you, tap the button again!");
            }
          }
          console.log("API Response:", responseData);
          
          // Resolve the promise with the answer
          resolve(answer);
        })
        .catch((error) => {
          console.error("Error calling API:", error);
          // Reject the promise with the error
          reject(error);
        });
    });
  }
  


export function startRecording() {
    return new Promise((resolve, reject) => { // Return a promise from startRecording
      let options = { audio: true, video: false };
      navigator.mediaDevices
        .getUserMedia(options)
        .then((stream) => {
          currentlyRecording = true;
          //   audioElement.controls = false;
        //   recorderButtonDiv.style.backgroundColor = "rgba(0,0,0,.3)";
        //   recorderButtonDiv.style.borderRadius = 0;
            recorderButtonDiv.style.color = "red";
          getUserMediaStream = stream;
          let AudioContext = window.AudioContext || window.webkitAudioContext;
          let audioContext = new AudioContext();
          let source = audioContext.createMediaStreamSource(stream);
          webAudioRecorder = new WebAudioRecorder(source, {
            workerDir: "web_audio_recorder_js/",
            encoding: "wav",
            options: {
              encodeAfterRecord: true,
              mp3: { bitRate: "320" },
            },
          });
          webAudioRecorder.onComplete = (webAudioRecorder, blob) => {
            blobToBase64(blob)
              .then((base64String) => {
                // Call the API and handle the response
                callAPI(base64String)
                  .then((answer) => {
                    // console.log("Returned answer:", answer);
                    resolve(answer); // Resolve the promise with the answer
                  })
                  .catch((error) => {
                    console.error(error);
                    reject(error); // Reject the promise with the error
                  });
              })
              .catch((err) => {
                console.error("Error converting blob to base64:", err);
                reject(err); // Reject the promise with the error
              });
            // let audioElementSource = window.URL.createObjectURL(blob);
            // audioElement.src = audioElementSource;
            // audioElement.controls = true;
            recorderButtonDiv.style.color = "white";
            // recorderButtonDiv.style.borderRadius = "50%";
          };
          webAudioRecorder.onError = (webAudioRecorder, err) => {
            console.error(err);
            reject(err); // Reject the promise with the error
          };
          webAudioRecorder.startRecording();
        })
        .catch((err) => {
          console.error(err);
          reject(err); // Reject the promise with the error
        });
    });
}
  

export function stopRecording() {
  let audioTrack = getUserMediaStream.getAudioTracks()[0];
  audioTrack.stop();
  webAudioRecorder.finishRecording();
  currentlyRecording = false;
}
