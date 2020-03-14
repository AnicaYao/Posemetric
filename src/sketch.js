// setup initializes this to a p5.js Video instance.
let video;
let count =1;
let timer = false;
let block1;
let block2;
let block3;
let mySound;
let gameoverSound;
let winSound;

let dotX1 = 0;
let dotY1 = 0;
let dotX2 = 0;
let dotY2 = 0;

let hit = 0;
let isHit = false;

let countdown = 20;

let isSoundPlayed = false;
let win = false;
let lose = false;



// p5js calls this code once when the page is loaded (and, during development,
// when the code is modified.)
export function setup() {
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
block1 = loadImage('block1.jpg');
block2 = loadImage('block2.jpg');
block3 = loadImage('block3.jpg');
mySound = loadSound('countdown.mp4');
gameoverSound = loadSound('gameover.mp4');
winSound = loadSound('win.mp4');


setInterval(function timeIt(){
  if (countdown > 0 && timer == true) {
    countdown--;
  }
}, 1000);

textFont('Georgia');


}

// p5js calls this function once per animation frame. In this program, it does
// nothing---instead, the call to `poseNet.on` in `setup` (above) specifies a
// function that is applied to the list of poses whenever PoseNet processes a
// video frame.
export function draw() {

fill(0);
textSize(56);
if (timer == true && isSoundPlayed == false && countdown == 20 ){
  mySound.loop();
  isSoundPlayed = true;
}


if (timer==true){

if (countdown >= 10) {
  text("0:" + countdown, 20,500);
}else if(countdown < 10) {
  text('0:0' + countdown,20,500);

}


}
if (collideCircleCircle(dotX1,dotY1,100,width/2+50,height-50,80)==true
&& collideCircleCircle(dotX2,dotY2,100,width/2-50,height-50,80)==true
&& countdown>=0  && isHit == false && countdown != 20 && lose == false){

if (win == false){
  winSound.play();
}

win = true;

text('Well done!',20,550);

timer = false;
count = 1;
countdown = 0;
isSoundPlayed = false;
mySound.stop();

} else if (countdown == 0 && win == false) {

isSoundPlayed = false;//test
hit = 0; //test

if (lose == false){
  gameoverSound.play();
}

lose = true;
text('game over', 20,550);
mySound.stop();

}

}

function drawPoses(poses) {
// Modify the graphics context to flip all remaining drawing horizontally.
// This makes the image act like a mirror (reversing left and right); this is
// easier to work with.


translate(width, 0); // move the left side of the image to the right
scale(-1.0, 1.0);
image(video, 0, 0, video.width, video.height);




rect(600,height/4-20,200,40);
image(block1,600,height/4-20,200,40);
rect(500,height/2-20,200,40);
image(block1,500,height/2-20,200,40);
rect(400,450-20,200,40);
image(block1,400,450-20,200,40);

rect(width/2-200, 0, 200,170);
image(block2,width/2-200, 0, 200,170);
rect(0,430,200,170);
image(block2,0,430,200,170);
rect(300,180,40,200);
image(block3,300,180,40,200);
rect(60,220,40,200);
image(block3,60,220,40,200);

fill(255,0,0,150);
noStroke();
ellipse(width/2-50,height-50,80,80);
ellipse(width/2+50,height-50,80,80);



if (poses[0]!= undefined){

var partname = poses[0].pose.keypoints;
var leftWrist = partname[9];
var rightWrist = partname[10];

let d1 = dist(leftWrist.position.x, leftWrist.position.y, width-50,50);
let d2 = dist(rightWrist.position.x, rightWrist.position.y, 50,50);

var blackX1 = leftWrist.position.x;
var blackY1 = leftWrist.position.y;
var blackX2 = rightWrist.position.x;
var blackY2 = rightWrist.position.y;
square(blackX1, blackY1, 20);
square(blackX2, blackY2, 20);

dotX1 = lerp(dotX1,blackX1,0.3);
dotY1 = lerp(dotY1,blackY1,0.3);
dotX2 = lerp(dotX2,blackX2,0.3);
dotY2 = lerp(dotY2,blackY2,0.3);


if (d1<=50 && count ==1 ) {

  fill(0,0,0);
  noStroke();
  ellipse(dotX1,dotY1,50,50);
  ellipse(dotX2,dotY2,50,50);

  fill(255,0,0);
  ellipse(1200-dotX1,height-dotY1,50,50);
  ellipse(400-dotX2,height-dotY2,50,50);

  isHit = false;
  timer = true;
if (hit == 0){ // make sure only the 1st time begins countdown
countdown = 20;
}

  count =2;
  win = false;//test
  lose = false;

} else if(count ==2 && isHit ==false ){

  fill(0,0,0);
  noStroke();
  ellipse(dotX1,dotY1,50,50);
  ellipse(dotX2,dotY2,50,50);

  fill(255,0,0);
  ellipse(1200-dotX1,height-dotY1,50,50);
  ellipse(400-dotX2,height-dotY2,50,50);

  //following we do the hit detection

if (collideRectCircle(600,height/4-20,200,40, dotX1,dotY1,50) == true
|| collideRectCircle(500,height/2-20,200,40,dotX1,dotY1,50) == true
|| collideRectCircle(400,450-20,200,40,dotX1,dotY1,50) == true){

  isHit = true;
  count =1;
  hit++;
}
if (collideRectCircle(width/2-200, 0, 200,170,width+400-dotX1,height-dotY1,50) == true){
  isHit == true;
  count =1;
  hit++;
}

if (collideRectCircle(width/2-200, 0, 200,170, dotX2,dotY2,50) == true
|| collideRectCircle(0,430,200,170, dotX2,dotY2,50) == true
|| collideRectCircle(300,180,40,200, dotX2,dotY2,50) == true
|| collideRectCircle(60,220,40,200, dotX2,dotY2,50) == true) {
  isHit == true;
  count =1;
  hit++;
}
if (collideRectCircle(width/2-200, 0, 200,170,width+400-dotX1,height-dotY1,50) == true){
  isHit == true;
  count =1;
  hit++;
}

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
