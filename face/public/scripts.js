// Defining Needed Variables
const emotions = ["neutral", "happy", "sad", "angry"];

let data = null;
let lastExpression = null;
let FaceDetected = false;
let isBusy = false;

let waitInterval = null;
let lastLogTime = 0;
const LOG_COOLDOWN = 5000;

const TITLE_TEXT = document.getElementById("status-text");
const BORDER = document.getElementById("container");
const VIDEO_FEED = document.getElementById("video-feed");
const CAMERA = document.getElementById("camera-feed");

const FPS = 2.5;
const INTERVAL = 1000 / FPS;

// checks what emotion has the highest value in the array
function indexOfMax(arr) {
  if (arr.length === 0) return -1;

  let max = arr[0];
  let maxIndex = 0;

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
      maxIndex = i;
    }
  }

  return maxIndex;
}

const run = async () => {
  // get the camera itself
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });

  CAMERA.autoplay = true;
  CAMERA.playsInline = true;
  CAMERA.srcObject = stream;

  // loads the lightweight TinyFaceDetector model and expression model
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("./models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("./models"),
    faceapi.nets.faceExpressionNet.loadFromUri("./models"),
  ]);
  console.log(
    "FaceAPI models loaded: TinyFaceDetector, Landmark68, ExpressionNet"
  );

  // continuously check for face + expression every INTERVAL
  setInterval(async () => {
    try {
      const faceAIData = await faceapi
        .detectSingleFace(
          CAMERA,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 128,
            scoreThreshold: 0.5,
          })
        )
        .withFaceLandmarks()
        .withFaceExpressions();

      FaceDetected = !!faceAIData;

      if (FaceDetected) {
        data = faceAIData.expressions;
        const values = emotions.map((e) => data[e]);
        const maxIdx = indexOfMax(values);
        BORDER.style.borderColor = "lime";
        lastExpression = emotions[maxIdx];
      } else {
        BORDER.style.borderColor = "red";
        lastExpression = null;
      }
    } catch (err) {
      console.error("FaceAPI error:", err);
      FaceDetected = false;
    }
  }, INTERVAL);
};

document.addEventListener("keypress", (event) => {
  const now = Date.now();
  const remaining = Math.ceil((LOG_COOLDOWN - (now - lastLogTime)) / 1000);

  if (now - lastLogTime > LOG_COOLDOWN) {
    if (lastExpression === null) {
      TITLE_TEXT.innerText = "Please Try Again!";
    } else if (lastExpression === "neutral") {
      TITLE_TEXT.innerText = "Please Make An Expression";
    } else {
      TITLE_TEXT.innerText = "Dominant expression: " + lastExpression;
      VIDEO_FEED.pause();
      VIDEO_FEED.currentTime = 0;
      VIDEO_FEED.src = `animations/${lastExpression}.mp4`;
      VIDEO_FEED.load();
      VIDEO_FEED.style.display = "block";

      VIDEO_FEED.onended = () => {
        VIDEO_FEED.style.display = "none";
        VIDEO_FEED.onended = null;
        VIDEO_FEED.src = "";
        TITLE_TEXT.innerText =
          "Please Look at The Camera and Press The Button! Once you made an expression";
      };
    }

    lastLogTime = now;

    if (waitInterval) {
      clearInterval(waitInterval);
      waitInterval = null;
    }
  } else {
    if (!waitInterval) {
      let secondsLeft = remaining;
      TITLE_TEXT.innerText = "Please wait " + secondsLeft;
      waitInterval = setInterval(() => {
        secondsLeft -= 1;
        if (secondsLeft > 0) {
          TITLE_TEXT.innerText = "Please wait " + secondsLeft;
        } else {
          TITLE_TEXT.innerText =
            "Please Look at The Camera and Press The Button! Once you made an expression";
          clearInterval(waitInterval);
          waitInterval = null;
        }
      }, 1000);
    }
  }
});

// stop the camera when the tab unloads
window.addEventListener("beforeunload", () => {
  const stream = CAMERA.srcObject;
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
});

run();
