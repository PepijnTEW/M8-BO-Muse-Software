console.log(faceapi);

const emotions = [
  "neutral",
  "happy",
  "sad",
  "angry",
  "fearful",
  "disgusted",
  "surprised",
];

let data = null;
let lastExpression = null;

//checks what animation has the highest value in the array
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
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });

  //get webcam video
  const videoFeedEl = document.getElementById("video-feed");
  videoFeedEl.autoplay = true;
  videoFeedEl.playsInline = true;
  videoFeedEl.style.display = "none";
  videoFeedEl.srcObject = stream;

  //loads all the AI models
  await Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri("./models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("./models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("./models"),
    faceapi.nets.faceExpressionNet.loadFromUri("./models"),
  ]);

  //gets all the data every 200ms
  setInterval(async () => {
    let faceAIData = await faceapi
      .detectAllFaces(videoFeedEl)
      .withFaceLandmarks()
      .withFaceDescriptors()
      .withFaceExpressions();

    faceAIData = faceapi.resizeResults(faceAIData, videoFeedEl);

    if (faceAIData.length > 0) {
      data = faceAIData[0].expressions;

      const values = emotions.map((e) => data[e]);
      const maxIdx = indexOfMax(values);
      lastExpression = emotions[maxIdx];
    }
  }, 200);
};

document.addEventListener("keypress", (event) => {
  console.log("Dominant expression:", lastExpression);
});

run();
