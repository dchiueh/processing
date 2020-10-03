let camera;

let current;

const textToWrite = "what are you channeling today";
const SEGMENTS    = 200;

//auto start variables
let centerX, centerY, fontSize, INNER_RADIUS, RADIUS_VARIATION;

list=["money","fortune","sadness","fame", "justice","what","nothing", "happiness", "luck", "beauty",
		 "love", "marriage", "empathy", "water", "electricity", "demons", "spirits", "energy", "misfortune"];

function setup() {
	
	createCanvas(windowWidth, windowHeight);
	camera = createCapture(VIDEO);
	camera.hide();
	
	
	centerX = windowWidth/2;
	centerY = windowHeight/2;
	
	let screenPct = min(height, width) / 1000;
	fontSize = screenPct * 100;
	INNER_RADIUS = screenPct * 300;
	RADIUS_VARIATION = screenPct * 200;
	
	textFont('Helvetica');
	textSize(fontSize);
	
  let img = createImage(windowWidth, windowHeight); // same as new p5.Image(100, 100);
  img.loadPixels();

  // helper for writing color to array
  function writeColor(image, x, y, red, green, blue, alpha) {
    let index = (x + y * width) * 4;
    image.pixels[index] = red;
    image.pixels[index + 1] = green;
    image.pixels[index + 2] = blue;
    image.pixels[index + 3] = alpha;
  }

  let x, y;
  // fill with random colors
  for (y = 0; y < img.height; y++) {
    for (x = 0; x < img.width; x++) {
      let red = random(255);
      let green = random(255);
      let blue = random(255);
      let alpha = 255;
      writeColor(img, x, y, red, green, blue, alpha);
    }
  }

  img.updatePixels();
  image(img, 0, 0);

}

//code adapted from @GoToLoop
//generates a circular noise with perfect looping
//https://forum.processing.org/one/topic/how-to-make-perlin-noise-loop.html
function pointForIndex(pct) {
	const NOISE_SCALE       = 1.5;
  let angle = pct * TWO_PI;
  let cosAngle = cos(angle);
  let sinAngle = sin(angle);
  let time = frameCount / 100;
  let noiseValue = noise(NOISE_SCALE * cosAngle + NOISE_SCALE, NOISE_SCALE * sinAngle + NOISE_SCALE, time);
  let radius = INNER_RADIUS + RADIUS_VARIATION * noiseValue;
  return {
		x: radius * cosAngle + centerX,
		y: radius * sinAngle + centerY
	};
}

function draw() {
	textSize(fontSize);
	image(camera, centerX-300, centerY-300, 600, 600);
	
	frameRate(15);
	fill(200,59,29);
	current = random(list);
	text(current, centerX-50, centerY);
	
	fill(random(255),random(255),random(255));
	
	//draw text
	let pct = atan2(mouseY - centerY, mouseX - centerX) / TWO_PI;//follow mouse
	//let pct = 0;//dont follow mouse
	let pixToAngularPct = 1/((INNER_RADIUS+RADIUS_VARIATION/2)*TWO_PI);
	for (var i = 0; i < textToWrite.length; i++) {
		let charWidth = textWidth(textToWrite.charAt(i));
		pct += charWidth/2 * pixToAngularPct;
		
		//calculate angle
		let leftP = pointForIndex(pct-0.01);
		let rightP = pointForIndex(pct+0.01);
		let angle = atan2(leftP.y - rightP.y, leftP.x - rightP.x) + PI;
		
		push();
			let p = pointForIndex(pct);
			//apply angle
			translate(p.x, p.y);
				rotate(angle);
			translate(-p.x, -p.y);
		
			text(textToWrite.charAt(i), p.x-charWidth/2, p.y);
		pop();
		
		pct += charWidth/2 * pixToAngularPct;
	}
}

function mouseClicked(){
	fill(random(255), random(255), random(255));
	textSize(20);
	text(current, mouseX, mouseY);
}
