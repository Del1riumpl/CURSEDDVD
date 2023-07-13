let x = 0,
  y = 0,
  dirX = 1,
  dirY = 1;
let speed = 2;
const maxSpeed = 2; // Maximum speed value
const slowDownRate = 0.05; // Rate at which the speed decreases when behind the screen
const pallete = ["#ff8800", "#e124ff", "#6a19ff", "#ff2188"];
const gravityTypes = ["Bounce", "Normal", "Jello", "Gravity", "Space", "By Circle"];
let dvd = document.getElementById("dvd");
dvd.style.backgroundColor = pallete[0];
let prevColorChoiceIndex = 0;
let prevGravityTypeIndex = 0;
let black = document.getElementById("black");
const dvdWidth = dvd.clientWidth;
const dvdHeight = dvd.clientHeight;

let gravityType = gravityTypes[0];

function getNewRandomColor() {
  const currentPallete = [...pallete];
  currentPallete.splice(prevColorChoiceIndex, 1);
  const colorChoiceIndex = Math.floor(Math.random() * currentPallete.length);
  prevColorChoiceIndex = colorChoiceIndex < prevColorChoiceIndex ? colorChoiceIndex : colorChoiceIndex + 1;
  const colorChoice = currentPallete[colorChoiceIndex];
  return colorChoice;
}

function getNewRandomGravityType() {
  const currentGravityTypes = [...gravityTypes];
  currentGravityTypes.splice(prevGravityTypeIndex, 1);
  const gravityTypeIndex = Math.floor(Math.random() * currentGravityTypes.length);
  prevGravityTypeIndex = gravityTypeIndex < prevGravityTypeIndex ? gravityTypeIndex : gravityTypeIndex + 1;
  const gravityTypeChoice = currentGravityTypes[gravityTypeIndex];
  return gravityTypeChoice;
}

function animate() {
  const screenHeight = document.body.clientHeight;
  const screenWidth = document.body.clientWidth;

  if (y + dvdHeight >= screenHeight || y < 0) {
    dirY *= -1;
    dvd.style.backgroundColor = getNewRandomColor();
    gravityType = getNewRandomGravityType();
    speed = maxSpeed; // Reset speed to maximum when hitting the screen edge
  }
  if (x + dvdWidth >= screenWidth || x < 0) {
    dirX *= -1;
    dvd.style.backgroundColor = getNewRandomColor();
    gravityType = getNewRandomGravityType();
    speed = maxSpeed; // Reset speed to maximum when hitting the screen edge
  }

  // Check if DVD logo is behind the screen
  if (x + dvdWidth <= 0 || x >= screenWidth || y + dvdHeight <= 0 || y >= screenHeight) {
    // Teleport DVD logo to the center
    x = (screenWidth - dvdWidth) / 2;
    y = (screenHeight - dvdHeight) / 2;
    speed -= slowDownRate; // Slow down the animation when behind the screen
    if (speed < 0) {
      speed = 0;
    }
  }

  switch (gravityType) {
    case "Bounce":
      if (y + dvdHeight >= screenHeight || y < 0) {
        dirY *= -1;
        dvd.style.backgroundColor = getNewRandomColor();
      }
      if (x + dvdWidth >= screenWidth || x < 0) {
        dirX *= -1;
        dvd.style.backgroundColor = getNewRandomColor();
      }
      break;
    case "Normal":
      dvd.style.transform = ""; // Reset transform to default
      break;
    case "Jello":
      if (y + dvdHeight >= screenHeight || y < 0) {
        dirY *= -1;
        dvd.style.backgroundColor = getNewRandomColor();
      }
      if (x + dvdWidth >= screenWidth || x < 0) {
        dirX *= -1;
        dvd.style.backgroundColor = getNewRandomColor();
      }
      dvd.style.transform = `rotate(${x * 0.5}deg)`; // Rotate DVD logo based on x position for jello effect
      break;
    case "Gravity":
      if (y + dvdHeight >= screenHeight || y < 0) {
        dirY *= -1;
        dvd.style.backgroundColor = getNewRandomColor();
        speed *= 1.2;
      }
      if (x + dvdWidth >= screenWidth || x < 0) {
        dirX *= -1;
        dvd.style.backgroundColor = getNewRandomColor();
        speed *= 1.2;
      }
      break;
    case "Space":
      if (y + dvdHeight >= screenHeight || y < 0 || x + dvdWidth >= screenWidth || x < 0) {
        dirY = Math.random() > 0.5 ? 1 : -1;
        dirX = Math.random() > 0.5 ? 1 : -1;
        dvd.style.backgroundColor = getNewRandomColor();
      }
      break;
    case "By Circle":
      const centerX = screenWidth / 2;
      const centerY = screenHeight / 2;
      const radius = Math.min(screenWidth, screenHeight) / 2 - dvdWidth;

      const angle = Math.atan2(y - centerY, x - centerX);
      const newX = centerX + radius * Math.cos(angle);
      const newY = centerY + radius * Math.sin(angle);

      if (Math.abs(x - newX) <= 1 && Math.abs(y - newY) <= 1) {
        const newAngle = angle + Math.PI / 2;
        const newXDir = Math.cos(newAngle);
        const newYDir = Math.sin(newAngle);

        dirX = newXDir;
        dirY = newYDir;
        dvd.style.backgroundColor = getNewRandomColor();
      }

      dvd.style.transform = `rotate(${x * 0.5}deg)`; // Rotate DVD logo based on x position for circle effect

      break;
    default:
      break;
  }

  x += dirX * speed;
  y += dirY * speed;
  dvd.style.left = x + "px";
  dvd.style.top = y + "px";
  window.requestAnimationFrame(animate);
}

window.requestAnimationFrame(animate);

// Reload button functionality
const reloadButton = document.createElement("button");
reloadButton.textContent = "Reload";
reloadButton.style.position = "fixed";
reloadButton.style.top = "10px";
reloadButton.style.right = "10px";
reloadButton.addEventListener("click", () => {
  // Restart animation with the same gravity type
  x = 0;
  y = 0;
  dirX = 1;
  dirY = 1;
  speed = maxSpeed;
  prevColorChoiceIndex = 0;
  dvd.style.backgroundColor = pallete[0];
  dvd.style.transform = "scale(1)";
  window.requestAnimationFrame(animate);
});
document.body.appendChild(reloadButton);

// Slow Down button functionality
const slowDownButton = document.createElement("button");
slowDownButton.textContent = "Slow Down";
slowDownButton.style.position = "fixed";
slowDownButton.style.top = "50px";
slowDownButton.style.right = "10px";
slowDownButton.addEventListener("click", () => {
  // Slow down the animation
  speed -= slowDownRate;
  if (speed < 0) {
    speed = 0;
  }
});
document.body.appendChild(slowDownButton);
