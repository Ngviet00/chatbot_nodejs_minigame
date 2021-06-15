let theWheel = new Winwheel({
   drawMode: "image",
   drawText: true,
   textOrientation: "curved",
   textAlignment: "outer",
   textMargin: 20,
   numSegments: 6,
   outerRadius: 212,
   textFontSize: 16,
   textFontFamily: 'Courier',
   textFontWeight: 'bold',
   segments: [
      { text: "MacBook Pro 2020" },
      { text: "Học\n\n Bổng\n\n 500.000đ" },
      { text: "Học\n\n Bổng\n\n 2 Triệu" },
      { text: "Học\n\n Bổng\n\n 1 Triệu" },
      { text: "Google Pixel 5Xl" },
      { text: "Iphone 12PRM" },
   ],
   animation: {
      type: "spinToStop",
      duration: 5,
      spins: 6,
      callbackSound: playSound,
      callbackFinished: alertPrize,
   },
});

let secondImg = new Image();
secondImg.onload = function () {
   theWheel.wheelImage = secondImg;
   theWheel.draw();
};
secondImg.src = "cb.png";

let wheelSpinning = false;
function startSpin() {
   if (wheelSpinning == false) {
      calculatePrize();
      theWheel.animation.spins = 8;
      theWheel.startAnimation();
      wheelSpinning = true;
   }
}

let audio = new Audio("tick.mp3");
function playSound() {
   audio.pause();
   audio.currentTime = 0;
   audio.play();
}

function calculatePrize() {
   let stopAt = 91 + Math.floor(Math.random() * 20);
   theWheel.animation.stopAngle = stopAt;
   theWheel.startAnimation();
}

function alertPrize(indicatedSegment) {
   const value = indicatedSegment.text;
   document.getElementById("verify").style.display = "block";
   document.getElementById("display_value_spin").value = value.replace(
      /(\r\n|\n|\r)/gm,
      ""
   );
}