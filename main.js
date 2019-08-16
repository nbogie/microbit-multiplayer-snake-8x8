function handleCollision() {
  apples.forEach(a => {
    if (player.pos.x === a.pos.x && player.pos.y === a.pos.y) {
      score = score + 1;
      radio.sendString("ateApple");
      renderNativeScreen();
      a.pos = randomMatrixPos();
    }
  });
}
function createApples() {
  apples = [];
  apples.push(createApple(1));
  apples.push(createApple(2));
  apples.push(createApple(3));
  apples.push(createApple(4));
}
function renderPlayfield() {
  strip.clear();
  strip.setMatrixColor(
    player.pos.x,
    player.pos.y,
    neopixel.colors(NeoPixelColors.Green)
  );
  apples.forEach(a => {
    strip.setMatrixColor(a.pos.x, a.pos.y, neopixel.colors(NeoPixelColors.Red));
  });
  strip.show();
}
radio.onReceivedString(function(receivedString) {
  led.toggle(0, 0);
  if (receivedString == "left") {
    player.pos.x -= 1;
  }
  if (receivedString == "right") {
    player.pos.x += 1;
  }
  if (receivedString == "up") {
    player.pos.y += 1;
  }
  if (receivedString == "down") {
    player.pos.y -= 1;
  } else {
  }
  handleCollision();
  renderPlayfield();
});
input.onGesture(Gesture.Shake, function() {
  strip.clear();
  strip.show();
});
function renderNativeScreen() {
  basic.showNumber(score, 0);
}
input.onButtonPressed(Button.A, function() {
  radio.sendString("left");
});
input.onButtonPressed(Button.B, function() {
  radio.sendString("right");
});
input.onPinPressed(TouchPin.P1, function() {
  radio.sendString("up");
});
input.onPinPressed(TouchPin.P2, function() {
  radio.sendString("down");
});
let score = 0;
let strip: neopixel.Strip = null;
let player: Player = null;
let apples: Apple[] = [];
let numberOfApples = 3;
function pick(arr: any[]): any {
  return arr[Math.randomRange(0, arr.length - 1)];
}
interface Player {
  pos: MatrixPos;
}
interface Apple {
  id: number;
  pos: MatrixPos;
}
interface MatrixPos {
  x: number;
  y: number;
}
function createApple(id: number): Apple {
  return { id: id, pos: randomMatrixPos() };
}
function randomMatrixPos(): MatrixPos {
  return { x: Math.randomRange(0, 7), y: Math.randomRange(0, 7) };
}
createApples();
basic.showString("S");
radio.setGroup(88);
strip = neopixel.create(DigitalPin.P0, 64, NeoPixelMode.RGB);
strip.setBrightness(110);
strip.setMatrixWidth(8);
player = { pos: randomMatrixPos() };
score = 0;
renderNativeScreen();
renderPlayfield();
radio.sendString("started");
