console.log(faceapi);

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
    const expressions = faceAIData[0].expressions;
    console.log(expressions);
  }, 200);
};

run();
