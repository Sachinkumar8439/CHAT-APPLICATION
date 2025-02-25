// sellebration script 
let timer;
function runAtMidnight() {
const now = new Date();
const midnight = new Date();
clearTimeout(timer);

// Set the time to midnight (00:00:00)
midnight.setHours(0,10, 0, 0);

// Calculate the time difference in milliseconds
const timeUntilMidnight = midnight - now;

console.log(`Time until midnight: ${timeUntilMidnight / 1000} seconds`);

// Use setTimeout to run the function at midnight
timer =  setTimeout(() => {
executeFunction();
}, timeUntilMidnight);
}

function startCelebration() {
const celebrationBox = document.querySelector('.celebration-box');
const emojisAndFlowers = ['😊', '🥰', '😍', '😄', '😃', '😂', '🤣', '😜', '🥳', '😘', '😚', '😎', '🤩', '🤗', '😺', '🐱', '🐻', '🌸', '🍭', '🌺', '🌻'];
const duration = 30000; // 30 seconds

// Start generating emojis and flowers
const interval = setInterval(() => {
createFallingItem(celebrationBox, emojisAndFlowers);
}, 100); // Generate items every 100ms

// Stop emoji generation after 30 seconds
setTimeout(() => {
clearInterval(interval);
}, duration);
}

function createFallingItem(container, items) {
const itemElement = document.createElement('div');
itemElement.classList.add('emoji'); // Default class as emoji (can also be flowers)
itemElement.innerText = items[Math.floor(Math.random() * items.length)];

// Randomize position, size, and animation duration
const randomLeft = Math.random() * 100;
const randomDuration = Math.random() * 2 + 1; // 1 to 3 seconds
const randomSize = Math.random() * 20 + 30; // 30px to 50px

itemElement.style.left = `${randomLeft}%`;
itemElement.style.fontSize = `${randomSize}px`;
itemElement.style.animationDuration = `${randomDuration}s`;

// Append to the celebration box
container.appendChild(itemElement);

// Keep the item at the bottom after animation ends
itemElement.addEventListener('animationend', () => {
itemElement.style.animation = 'none';
itemElement.style.transform = `translateY(calc(100vh - ${randomSize + 10}px))`;
itemElement.style.position = 'absolute';
});
}

// Your function to execute
function executeFunction() {
console.log("The function is executed at midnight!");
let selhtml = `<div class="celebration-box">
<div class="frame"></div>
<div class="inner-frame"></div>
<div class="seleberation-text">
<h3 class="merigolu"><span>M</span>eri <span>G</span>olu</h3>
<h3 class="happy"><span>H</span>appy</h3>
<h3 class="makar"><span>M</span>akar<span>S</span>ankranti</h3>
<p class="emo">😊🥰😍🤗</p>
</div>
<div class="moon"></div>
<div class="star" style="top: 15%; left: 20%;"></div>
<div class="star" style="top: 40%; left: 60%;"></div>
<div class="twinkling-star" style="top: 25%; left: 50%;"></div>
<div class="twinkling-star" style="top: 50%; left: 70%;"></div>
<div class="star" style="top: 70%; left: 30%;"></div>
<div class="twinkling-star" style="top: 10%; left: 40%;"></div>
<div class="twinkling-star" style="top: 80%; left: 10%;"></div>
<div class="star" style="top: 60%; left: 90%;"></div>
<audio src="twinkle.mp3" autoplay loop  style="display: none;"></audio>
</div>`
document.querySelector('.messages').innerHTML='';
document.querySelector('.messages').innerHTML=selhtml;
document.getElementById("message-input").blur();

startCelebration();

}