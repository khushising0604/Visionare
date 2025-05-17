const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Load the default glasses image
let glassesImage = new Image();
glassesImage.src = '../images/products/black eye.png'; // default frame

// Change glasses if needed (on button click)
function changeGlasses(style) {
  const newSrc = `../images/products/${style}.png`;
  if (glassesImage.src !== newSrc) {
    const newImage = new Image();
    newImage.onload = () => {
      glassesImage = newImage;
    };
    newImage.src = newSrc;
  }
}

// Resize canvas to match video size
function resizeCanvas() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
}

// Setup the user's camera
async function setupCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;

  video.addEventListener('loadedmetadata', () => {
    resizeCanvas();
  });
}

// FaceMesh setup
const faceMesh = new FaceMesh({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
});

faceMesh.setOptions({
  maxNumFaces: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});

faceMesh.onResults(onResults);

// Start the camera and FaceMesh
const camera = new Camera(video, {
  onFrame: async () => {
    await faceMesh.send({ image: video });
  },
  width: 640,
  height: 480,
});
camera.start();

// Smooth transition helpers
let prevX = null, prevY = null, prevWidth = null, prevHeight = null, prevAngle = null;

function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}

// Calculate angle between two points
function calculateAngle(point1, point2) {
  return Math.atan2(point2.y - point1.y, point2.x - point1.x);
}

function onResults(results) {
  resizeCanvas();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

  if (results.multiFaceLandmarks.length > 0) {
    const landmarks = results.multiFaceLandmarks[0];

    // Better facial landmark points for glasses positioning
    const leftEyeOuter = landmarks[33];
    const rightEyeOuter = landmarks[263];
    const leftEyeInner = landmarks[133];
    const rightEyeInner = landmarks[362];
    const noseBridge = landmarks[168];
    const noseTop = landmarks[6];
    const noseBottom = landmarks[4];
    const leftTemple = landmarks[234];
    const rightTemple = landmarks[454];
    const leftEar = landmarks[58];
    const rightEar = landmarks[288];

    // Calculate face width including temples for better scaling
    const faceWidth = Math.abs(leftTemple.x - rightTemple.x) * canvas.width;

    // Calculate center point between eyes
    const eyeCenterX = ((leftEyeInner.x + rightEyeInner.x) / 2) * canvas.width;
    const eyeCenterY = ((leftEyeInner.y + rightEyeInner.y) / 2) * canvas.height;

    // Calculate glasses parameters with better proportions
    const targetWidth = faceWidth * 1.15;
    const targetHeight = targetWidth * 0.4;

    // Position centered on eyes but adjusted for nose bridge
    const targetX = eyeCenterX - (targetWidth / 2);
    const targetY = eyeCenterY - (targetHeight * 0.5) + (noseBridge.y - noseTop.y) * canvas.height * 0.15;

    // Calculate angle for rotation based on eye positions
    const angle = calculateAngle(
      {x: leftEyeOuter.x * canvas.width, y: leftEyeOuter.y * canvas.height},
      {x: rightEyeOuter.x * canvas.width, y: rightEyeOuter.y * canvas.height}
    );

    // Initialize previous values if needed
    if (prevX === null) {
      prevX = targetX;
      prevY = targetY;
      prevWidth = targetWidth;
      prevHeight = targetHeight;
      prevAngle = angle;
    }

    // Smooth transition for all parameters
    prevX = lerp(prevX, targetX, 0.25);
    prevY = lerp(prevY, targetY, 0.25);
    prevWidth = lerp(prevWidth, targetWidth, 0.25);
    prevHeight = lerp(prevHeight, targetHeight, 0.25);
    prevAngle = lerp(prevAngle, angle, 0.15);

    // Save context state before transformations
    ctx.save();

    // Move to center point of glasses
    ctx.translate(prevX + prevWidth / 2, prevY + prevHeight / 2);

    // Rotate context to match face angle
    ctx.rotate(prevAngle);

    // Draw the glasses (centered at origin after translation)
    ctx.drawImage(glassesImage, -prevWidth / 2, -prevHeight / 2, prevWidth, prevHeight);

    // Restore context to remove transformations
    ctx.restore();

    // Debug visualization (uncomment to see landmarks)
    /*
    ctx.fillStyle = 'red';
    [leftEyeOuter, rightEyeOuter, leftEyeInner, rightEyeInner, noseBridge, 
     leftTemple, rightTemple, leftEar, rightEar].forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x * canvas.width, point.y * canvas.height, 3, 0, 2 * Math.PI);
      ctx.fill();
    });
    */
  }
}

// Initialize camera
(async () => {
  await setupCamera();
})();
