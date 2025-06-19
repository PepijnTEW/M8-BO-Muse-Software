// Defining Needed Variables
const emotions = ["neutral", "happy", "sad", "angry"];

let data = null;
let lastExpression = null;
let FaceDetected = false;
let isVideoPlaying = false; // flag to pause detection during video

let waitInterval = null;
let lastLogTime = 0;
const LOG_COOLDOWN = 5000;

// UI Elements
const TITLE_TEXT = document.getElementById("status-text");
const BORDER = document.getElementById("container");
const CAMERA = document.getElementById("camera-feed");
const VIDEO_FEED = document.getElementById("video-feed");

const FPS = 2.5;
const INTERVAL = 1000 / FPS;

// Helper: find index of max value in an array
function indexOfMax(arr) {
  if (!arr || arr.length === 0) return -1;
  return arr.reduce(
    (maxIdx, val, idx, array) => (val > array[maxIdx] ? idx : maxIdx),
    0
  );
}

/**
 * Main initialization: get camera and load FaceAPI models
 */
const run = async () => {
  // initialize camera
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });
  CAMERA.autoplay = true;
  CAMERA.playsInline = true;
  CAMERA.srcObject = stream;

  // load detection & expression models
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("./models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("./models"),
    faceapi.nets.faceExpressionNet.loadFromUri("./models"),
  ]);
  console.log("FaceAPI models loaded");

  // detection loop
  setInterval(async () => {
    if (isVideoPlaying) return; // skip detection while video plays
    try {
      const detection = await faceapi
        .detectSingleFace(
          CAMERA,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 512,
            scoreThreshold: 0.3,
          })
        )
        .withFaceLandmarks()
        .withFaceExpressions();

      if (detection) {
        FaceDetected = true;
        data = detection.expressions;
        const values = emotions.map((e) => data[e]);
        const maxIdx = indexOfMax(values);
        BORDER.style.borderColor = "lime";
        lastExpression = emotions[maxIdx];
      } else {
        FaceDetected = false;
        BORDER.style.borderColor = "red";
        lastExpression = null;
      }
    } catch (err) {
      console.error("FaceAPI error:", err);
      FaceDetected = false;
      lastExpression = null;
    }
  }, INTERVAL);
};

/**
 * Handle keypress: show expression and play corresponding video
 */
const handlePress = () => {
  // prevent re-trigger during video playback
  if (isVideoPlaying) return;
  const now = Date.now();
  if (now - lastLogTime <= LOG_COOLDOWN) return;
  lastLogTime = now;

  if (!lastExpression) {
    TITLE_TEXT.innerText = "Please Try Again!";
  } else if (lastExpression === "neutral") {
    TITLE_TEXT.innerText = "Please Make An Expression";
  } else {
    TITLE_TEXT.innerText = "Dominant expression: " + lastExpression; // keep lime border during playback
    BORDER.style.borderColor = "lime";
    // play video for the detected expression
    isVideoPlaying = true;
    VIDEO_FEED.pause();
    VIDEO_FEED.currentTime = 0;
    VIDEO_FEED.src = `animations/${lastExpression}.mp4`;
    VIDEO_FEED.load();
    VIDEO_FEED.style.display = "block";
    VIDEO_FEED.play().catch((err) => console.warn("Playback error:", err));

    // hide when done
    VIDEO_FEED.onended = () => {
      isVideoPlaying = false;
      VIDEO_FEED.style.display = "none";
      VIDEO_FEED.onended = null;
      VIDEO_FEED.src = "";
      TITLE_TEXT.innerText =
        "Please Look at The Camera and Press The Button! Once you make an expression";
    };
  }
};

document.addEventListener("keypress", handlePress);

// cleanup on unload
window.addEventListener("beforeunload", () => {
  const stream = CAMERA.srcObject;
  if (stream) stream.getTracks().forEach((track) => track.stop());
});

// start detection
run();
