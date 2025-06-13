//Defining Needed Variables
const emotions = ["neutral", "happy", "sad", "angry"];

let data = null;
let lastExpression = null;

let waitInterval = null;
let lastLogTime = 0;
const LOG_COOLDOWN = 5000;

const TITLE_TEXT = document.getElementById("statusText");

const videoFeed = document.getElementById("video-feed");

const FPS = 5;
const INTERVAL = 1000 / FPS;
//checks what emotion has the highest value in the array
function indexOfMax(arr) {
  if (arr.length === 0) {
    return -1;
  }

  let max = arr[0];
  let maxIndex = 0;

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      maxIndex = i;
      max = arr[i];
    }
  }

  return maxIndex;
}

const run = async () => {
  //get the camera itself
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });
  const camera = document.getElementById("camera-feed");
  camera.autoplay = true;
  camera.playsInline = true;
  camera.srcObject = stream;

  //loads all the AI models
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("./models"),
    faceapi.nets.ssdMobilenetv1.loadFromUri("./models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("./models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("./models"),
    faceapi.nets.faceExpressionNet.loadFromUri("./models"),
  ]);

  //gets all the data every 1s
  setInterval(async () => {
    try {
      let faceAIData = await faceapi
        .detectAllFaces(camera, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors()
        .withFaceExpressions();

      if (faceAIData.length > 0) {
        data = faceAIData[0].expressions;
        const values = emotions.map((e) => data[e]);
        const maxIdx = indexOfMax(values);
        lastExpression = emotions[maxIdx];
      }
    } catch (err) {
      console.error("FaceAPI error:", err);
    }
  }, INTERVAL);
};

document.addEventListener("keypress", (event) => {
  const now = Date.now();
  const remaining = Math.ceil((LOG_COOLDOWN - (now - lastLogTime)) / 1000);

  if (now - lastLogTime > LOG_COOLDOWN) {
    if (lastExpression === null) {
      TITLE_TEXT.innerText = "Please Try Again!";
      lastLogTime = now;
    } else if (lastExpression === "neutral") {
      TITLE_TEXT.innerText = "Please Make A Expression";
      lastLogTime = now;
    } else TITLE_TEXT.innerText = "Dominant expression: " + lastExpression;
    lastLogTime = now;

    // Clear any running countdown
    if (waitInterval) {
      clearInterval(waitInterval);
      waitInterval = null;
    }
  } else {
    // Start countdown if the user presses it faster than 1 time per 5seconds
    if (!waitInterval) {
      let secondsLeft = remaining;
      TITLE_TEXT.innerText = "Please wait " + secondsLeft;
      waitInterval = setInterval(() => {
        secondsLeft -= 1;
        if (secondsLeft > 0) {
          TITLE_TEXT.innerText = "Please wait " + secondsLeft;
        } else {
          TITLE_TEXT.innerText =
            " Please Look at The Camera and Press The Button! Once you made a expression";
          clearInterval(waitInterval);
          waitInterval = null;
        }
      }, 1000);
    }
  }
});

//for developing this is not my code this is to stop the camera when the tab unloads

run();
