// setup initializes this to a p5.js Video instance.
let video;
let count =1;

let dotX = 0;
let dotY = 0;

// let black = new Array(2);

// let lerpedblackX = [];
// let lerpedblackY = [];

// p5js calls this code once when the page is loaded (and, during development,
// when the code is modified.)
export function setup() {
  // createCanvas(640, 480);
  createCanvas(800, 600);
  video = select("video") || createCapture(VIDEO);
  video.size(width, height);

  // Create a new poseNet method with single-pose detection. The second argument
  // is a function that is called when the model is loaded. It hides the HTML
  // element that displays the "Loading model…" text.
  const poseNet = ml5.poseNet(video, () => select("#status").hide());

  // Every time we get a new pose, apply the function `drawPoses` to it (call
  // `drawPoses(poses)`) to draw it.
  poseNet.on("pose", drawPoses);

  // Hide the video element, and just show the canvas
  video.hide();





}

// p5js calls this function once per animation frame. In this program, it does
// nothing---instead, the call to `poseNet.on` in `setup` (above) specifies a
// function that is applied to the list of poses whenever PoseNet processes a
// video frame.
export function draw() {}

function drawPoses(poses) {
  // Modify the graphics context to flip all remaining drawing horizontally.
  // This makes the image act like a mirror (reversing left and right); this is
  // easier to work with.
  translate(width, 0); // move the left side of the image to the right
  scale(-1.0, 1.0);
  image(video, 0, 0, video.width, video.height);
  // background(0,0,0,20);
  // drawKeypoints(poses);
  // drawSkeleton(poses);

  //draw obstacles
  fill(0,0,0);
  noStroke();
  rect(500,height/2-20,200,40);
  rect(600,height/4-20,200,40);
  rect(400,450-20,200,40);

  if (poses[0]!= undefined){
    console.log(poses);
    var partname = poses[0].pose.keypoints;
    // console.log(partname);
    var leftWrist = partname[9];
    var rightWrist = partname[10];
    // console.log(leftWrist);
    // console.log(rightWrist);

    let d = dist(leftWrist.position.x, leftWrist.position.y, width-50,50);
    // console.log(d);
    var blackX = leftWrist.position.x;
    var blackY = leftWrist.position.y;
    square(blackX, blackY, 20);

    dotX = lerp(dotX,blackX,0.3);
    dotY = lerp(dotY,blackY,0.3);

    if (d<=50 && count ==1) {
      // for (let j=0; j<leftWrist.length; j++){
      //   lerpedblackX[j] = lerp(lerpedblackX[j],blackX, 0.5);
      //   lerpedblackY[j] = lerp(lerpedblackY[j],blackY, 0.5);
      // }
      fill(0,0,0);
      noStroke();
      // ellipse(blackX,blackY,50,50);
      ellipse(dotX,dotY,50,50);
      // ellipse(lerpedblackX[j],lerpedblackY[j],50,50);
      fill(255,0,0);

      ellipse(width+400-dotX,height-dotY,50,50);
      count =2;
    } else if(count ==2){

      fill(0,0,0);
      noStroke();
      // ellipse(blackX,blackY,50,50);
      ellipse(dotX,dotY,50,50);
      // ellipse(lerpedblackX[j],lerpedblackY[j],50,50);
      fill(255,0,0);

      ellipse(width+400-dotX,height-dotY,50,50);

    }
  }

}





// Draw ellipses over the detected keypoints
function drawKeypoints(poses) {
  // console.log(poses);
  poses.forEach(pose =>
    pose.pose.keypoints.forEach(keypoint => {
      if (keypoint.score > 0.2) {
        fill(0, 255, 0);
        // noStroke()；
        square(keypoint.position.x, keypoint.position.y,20);

      }
    })
  );
}

// Draw connections between the skeleton joints.
function drawSkeleton(poses) {
  poses.forEach(pose => {
    pose.skeleton.forEach(skeleton => {
      // skeleton is an array of two keypoints. Extract the keypoints.
      const [p1, p2] = skeleton;
      // console.log("p1 score =",p1.score);
      // console.log("p2 score =",p2.score);
      stroke(150, 0, 255);
      strokeWeight(p1.score*p2.score*10);
      line(p1.position.x, p1.position.y, p2.position.x, p2.position.y);
    });
  });
}
