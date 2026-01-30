//Notes: All comments are AI generated for educational purposes.

function rollDice() {
  // Roll three dice (values 1-6)
  var randomNumber1 = Math.floor(Math.random() * 6) + 1;
  var randomNumber2 = Math.floor(Math.random() * 6) + 1;
  var randomNumber3 = Math.floor(Math.random() * 6) + 1;

  // Build image source paths for each roll
  var randomImageSource1 = "images/dice" + randomNumber1 + ".png";
  var randomImageSource2 = "images/dice" + randomNumber2 + ".png";
  var randomImageSource3 = "images/dice" + randomNumber3 + ".png";

  // Try to set the three image elements; fall back to class selectors if needed
  var imgs = document.querySelectorAll("img");
  if (imgs.length >= 3) {
    imgs[0].setAttribute("src", randomImageSource1);
    imgs[1].setAttribute("src", randomImageSource2);
    imgs[2].setAttribute("src", randomImageSource3);
  } else {
    var img1 = document.querySelector(".img1");
    var img2 = document.querySelector(".img2");
    var img3 = document.querySelector(".img3");
    if (img1) img1.setAttribute("src", randomImageSource1);
    if (img2) img2.setAttribute("src", randomImageSource2);
    if (img3) img3.setAttribute("src", randomImageSource3);
  }

  // Determine the winner: highest unique roll wins. If the highest value appears more than once, it's a draw.
  var max = Math.max(randomNumber1, randomNumber2, randomNumber3);
  var countMax = 0;
  if (randomNumber1 === max) countMax++;
  if (randomNumber2 === max) countMax++;
  if (randomNumber3 === max) countMax++;

  if (countMax > 1) {
    document.querySelector("h1").innerHTML = "Draw!";
  } else {
    var winner;
    if (randomNumber1 === max) winner = 1;
    else if (randomNumber2 === max) winner = 2;
    else winner = 3;
    document.querySelector("h1").innerHTML = "🚩 Player " + winner + " Wins!";
  }
}

// Run once on load
// Helper to update guide text
function setGuide(msg) {
  var guide = document.getElementById('guide');
  if (guide) guide.textContent = msg;
}

setGuide('Click Play to roll');
rollDice();

// Wire Play button to reroll without refreshing
var playBtn = document.getElementById("play-btn");
if (playBtn) {
  playBtn.addEventListener("click", function() {
    // show a short message while rolling
    setGuide('Rolling...');
    // slight delay to make message visible
    setTimeout(function() {
      rollDice();
      // show result hint briefly
      setGuide('Click Play to roll again');
    }, 200);
  });
}
