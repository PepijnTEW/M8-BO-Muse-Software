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

const run = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });
  const videoFeedEl = document.getElementById("video-feed");
  videoFeedEl.srcObject = stream;

  //loading models
  //these are all pre trained models for facial detection
  await Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri("./models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("./models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("./models"),
    faceapi.nets.faceExpressionNet.loadFromUri("./models"),
  ]);

  const canvas = document.getElementById("canvas");

  canvas.height = videoFeedEl.videoHeight;
  canvas.width = videoFeedEl.videoWidth;

  //facial detection in realtime
  setInterval(async () => {
    let faceAIData = await faceapi
      .detectAllFaces(videoFeedEl)
      .withFaceLandmarks()
      .withFaceDescriptors()
      .withFaceExpressions();
    //draw on our canvas

    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    //draw bounding box
    faceAIData = faceapi.resizeResults(faceAIData, videoFeedEl);
    faceapi.draw.drawDetections(canvas, faceAIData);
    faceapi.draw.drawFaceExpressions(canvas, faceAIData);
    data = faceAIData[0]?.expressions;
  }, 200);
};
let data = null;

addEventListener("keypress", (event) => {
  console.log(data);
  console.log(lastExpressions);
});

function checkDom(arr) {
  if (arr.length === 0) {
    return -1;
  }

  var max = arr[0];
  var maxIndex = 0;

  for (var i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      maxIndex = i;
      max = arr[i];
    }
  }

  return maxIndex;
}
const lastExpressions = data.map((obj) => {
  const values = emotions.map((emotion) => obj[emotion]);
  const maxIdx = indexOfMax(values);
  return emotions[maxIdx]; // return dominant emotion as string
});
run();
