input.onButtonPressed(Button.A, function() {
  radio.sendString(playerNumber + (isHorizontals ? "left" : "up"));
});
input.onButtonPressed(Button.B, function() {
  radio.sendString(playerNumber + (isHorizontals ? "right" : "down"));
});
input.onPinPressed(TouchPin.P2, function() {
  radio.sendString(playerNumber + (isHorizontals ? "up" : "left"));
});
input.onPinPressed(TouchPin.P1, function() {
  radio.sendString(playerNumber + (isHorizontals ? "down" : "right"));
});
radio.onReceivedString(function(receivedString) {
  led.toggle(0, 0);
  if (receivedString == "ateApple") {
    music.playTone(pick([Note.C5, Note.D5, Note.E5, Note.G5, Note.A5]), 50);
  }
  if (receivedString == "started") {
    music.beginMelody(music.builtInMelody(Melodies.JumpUp), MelodyOptions.Once);
  } else {
  }
});
function pick(arr: any[]): any {
  return arr[Math.randomRange(0, arr.length - 1)];
}
let playerNumber = 1;
if (input.buttonIsPressed(Button.A)) {
  playerNumber = 2;
}
if (input.buttonIsPressed(Button.B)) {
  playerNumber = 3;
}
if (input.pinIsPressed(TouchPin.P1)) {
  playerNumber = 4;
}

let isHorizontals = !(input.rotation(Rotation.Roll) < -45);

basic.showNumber(playerNumber, 100);
basic.showString(isHorizontals ? "_" : "|");
radio.setGroup(88);