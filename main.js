function toggleControlInterpretation() {
  controlInterpretationNormal = !controlInterpretationNormal;
}
function showScoreOnLEDs(score: number, startColumn: number) {
  [
    [0, 4],
    [0, 3],
    [0, 2],
    [0, 1],
    [0, 0],
    [1, 4],
    [1, 3],
    [1, 2],
    [1, 1],
    [1, 0]
  ].forEach((pos, ix) => {
    if (ix < score) {
      led.plot(pos[0] + startColumn, pos[1]);
    }
  });
}
function renderNativeScreen() {
  basic.clearScreen();
  showScoreOnLEDs(player1.score, 0);
  showScoreOnLEDs(player2.score, 3);
}

function respawnApple(apple: Apple) {
  apple.pos = randomMatrixPos();
  apple.dieTime = input.runningTime() + 100 * Math.randomRange(20, 40);
}
function handleCollision() {
  apples
    .filter(a => a.dieTime > input.runningTime())
    .forEach(a => {
      players.forEach(p => {
        if (p.pos.x === a.pos.x && p.pos.y === a.pos.y) {
          p.score = p.score + 1;
          radio.sendString("ateApple");
          renderNativeScreen();
          respawnApple(a);
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

function moveDown(p: Player) {
  p.pos.y -= 1;
}
function moveUp(p: Player) {
  p.pos.y += 1;
}

function moveLeft(p: Player) {
  p.pos.x -= 1;
}

function moveRight(p: Player) {
  p.pos.x += 1;
}

radio.onReceivedString(function(receivedString) {
  if (timeForInputSwitch < input.runningTime()) {
    toggleControlInterpretation();
    radio.sendString("rotated");
    timeForInputSwitch = input.runningTime() + 10000;
  }
  led.toggle(0, 0);
  let playerNumber: number = parseInt(receivedString.charAt(0));
  if (playerNumber) {
    let player = players[playerNumber - 1];
    switch (receivedString.substr(1)) {
      case "left":
        controlInterpretationNormal ? moveLeft(player) : moveUp(player);
        break;
      case "right":
        controlInterpretationNormal ? moveRight(player) : moveDown(player);
        break;
      case "up":
        controlInterpretationNormal ? moveUp(player) : moveLeft(player);
        break;
      case "down":
        controlInterpretationNormal ? moveDown(player) : moveRight(player);
        break;
      default:
        break;
    }
  } else {
    switch (receivedString) {
      case "debug":
        basic.showIcon(IconNames.Ghost);
        break;
    }
  }
  updateTimedObjects();
  handleCollision();
  renderPlayfield();
});
function updateTimedObjects() {
  //revive any apples dead more than n seconds
  apples.forEach(a => {
    if (a.dieTime < input.runningTime() - 2000) {
      respawnApple(a);
    }
  });
}

input.onGesture(Gesture.Shake, function() {
  strip.clear();
  strip.show();
});
function renderPlayfield() {
  strip.clear();
  players.forEach((p, ix) => {
    strip.setMatrixColor(p.pos.x, p.pos.y, p.color);
  });
  apples
    .filter(a => a.dieTime > input.runningTime())
    .forEach(a => {
      strip.setMatrixColor(
        a.pos.x,
        a.pos.y,
        neopixel.colors(NeoPixelColors.Red)
      );
    });
  strip.show();
}
input.onButtonPressed(Button.A, function() {
  radio.sendString("1left");
});
input.onButtonPressed(Button.B, function() {
  radio.sendString("1right");
});
input.onPinPressed(TouchPin.P1, function() {
  radio.sendString("1up");
});
input.onPinPressed(TouchPin.P2, function() {
  radio.sendString("1down");
});
let apples: Apple[] = [];
let strip: neopixel.Strip = null;
let players: Player[] = [];
let numberOfApples = 3;
function pick(arr: any[]): any {
  return arr[Math.randomRange(0, arr.length - 1)];
}
interface Player {
  pos: MatrixPos;
  score: number;
  color: number;
}
interface Apple {
  id: number;
  pos: MatrixPos;
  dieTime: number;
}
interface MatrixPos {
  x: number;
  y: number;
}
function createApple(id: number): Apple {
  return {
    id: id,
    pos: randomMatrixPos(),
    dieTime: input.runningTime() + 2000
  };
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
  score: 0,
  color: neopixel.colors(NeoPixelColors.Green)
};
let player2: Player = {
  pos: randomMatrixPos(),
  score: 0,
  color: neopixel.colors(NeoPixelColors.Blue)
};
let timeForInputSwitch: number = input.runningTime() + 10000;
let controlInterpretationNormal = true;
players.push(player1);
players.push(player2);
renderNativeScreen();
renderPlayfield();
radio.sendString("started");
