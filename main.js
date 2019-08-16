let players: Player[] = [];
function handleCollision() {
  apples.forEach(a => {
    players.forEach(p => {
      if (p.pos.x === a.pos.x && p.pos.y === a.pos.y) {
        score = score + 1;
        radio.sendString("ateApple");
        renderNativeScreen();
        a.pos = randomMatrixPos();
      }
    });
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
  players.forEach((p, ix) => {
    strip.setMatrixColor(p.pos.x, p.pos.y, p.color);
  });
  apples.forEach(a => {
    strip.setMatrixColor(a.pos.x, a.pos.y, neopixel.colors(NeoPixelColors.Red));
  });
  strip.show();
}
radio.onReceivedString(function(receivedString) {
  led.toggle(0, 0);
  if (receivedString == "left") {
    player1.pos.x -= 1;
    player2.pos.x -= 1;
  }
  if (receivedString == "right") {
    player1.pos.x += 1;
    player2.pos.x += 1;
  }
  if (receivedString == "up") {
    player1.pos.y += 1;
    player2.pos.y += 1;
  }
  if (receivedString == "down") {
    player1.pos.y -= 1;
    player2.pos.y -= 1;
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
let apples: Apple[] = [];
let numberOfApples = 3;
function pick(arr: any[]): any {
  return arr[Math.randomRange(0, arr.length - 1)];
}
interface Player {
  pos: MatrixPos;
  color: number;
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
let player1: Player = {
  pos: randomMatrixPos(),
  color: neopixel.colors(NeoPixelColors.Green)
};
let player2: Player = {
  pos: randomMatrixPos(),
  color: neopixel.colors(NeoPixelColors.Blue)
};
players.push(player1);
players.push(player2);

score = 0;
renderNativeScreen();
renderPlayfield();
radio.sendString("started");
