/*
sent messages:
=============
started
ateApple
rotated
gameOver
p1Won
p2Won

received messages:
==================
start
1left
1right
1up
1down
*/

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
  if (isGameOver()) {
    basic.showString(player1.score > player2.score ? "1" : "2");
  } else {
    showScoreOnLEDs(player1.score, 0);
    showScoreOnLEDs(player2.score, 3);
  }
}

function respawnApple(apple: Apple) {
  apple.pos = randomMatrixPos();
  apple.dieTime = input.runningTime() + 100 * Math.randomRange(20, 40);
}
function isGameOver() {
  return players.some(p => p.score >= targetScore);
}

function handlePickups() {
  apples
    .filter(a => a.dieTime > input.runningTime())
    .forEach(a => {
      players.forEach(p => {
        if (p.pos.x === a.pos.x && p.pos.y === a.pos.y) {
          p.score = p.score + 1;
          if (!isGameOver()) {
            radio.sendString("ateApple");
            respawnApple(a);
          }
          renderNativeScreen();
        }
      });
    });
}
function createApples(num: Number) {
  apples = [];
  for (let i = 0; i < num; i++) {
    apples.push(createApple(i));
  }
}
function inBounds(pos: MatrixPos) {
  return pos.x >= 0 && pos.x < 8 && pos.y >= 0 && pos.y < 8;
}
function incrementOrReset(pos: MatrixPos, fn: any) {
  const candidatePos = { x: pos.x, y: pos.y };
  fn(candidatePos);
  if (inBounds(candidatePos)) {
    pos.x = candidatePos.x;
    pos.y = candidatePos.y;
    return true;
  } else {
    return false;
  }
}

function tryToMoveDown(p: Player) {
  return incrementOrReset(p.pos, (p: MatrixPos) => (p.y -= 1));
}

function tryToMoveUp(p: Player) {
  return incrementOrReset(p.pos, (p: MatrixPos) => (p.y += 1));
}

function tryToMoveLeft(p: Player) {
  return incrementOrReset(p.pos, (p: MatrixPos) => (p.x -= 1));
}

function tryToMoveRight(p: Player) {
  return incrementOrReset(p.pos, (p: MatrixPos) => (p.x += 1));
}

radio.onReceivedString(function(receivedString) {
  if (isGameOver()) {
    if (receivedString === "start") {
      control.reset();
    } else {
      return;
    }
  }
  if (timeForInputSwitch < input.runningTime()) {
    toggleControlInterpretation();
    radio.sendString("rotated");
    timeForInputSwitch = input.runningTime() + 10000;
  }
  led.toggle(0, 0);
  let playerNumber: number = parseInt(receivedString.charAt(0));
  if (playerNumber) {
    let player = players[playerNumber - 1];
    let moved;
    player.outOfBoundsAttempted = false;
    switch (receivedString.substr(1)) {
      case "left":
        moved = controlInterpretationNormal
          ? tryToMoveLeft(player)
          : tryToMoveUp(player);
        break;
      case "right":
        moved = controlInterpretationNormal
          ? tryToMoveRight(player)
          : tryToMoveDown(player);
        break;
      case "up":
        moved = controlInterpretationNormal
          ? tryToMoveUp(player)
          : tryToMoveLeft(player);
        break;
      case "down":
        moved = controlInterpretationNormal
          ? tryToMoveDown(player)
          : tryToMoveRight(player);
        break;
      default:
        break;
    }
    player.outOfBoundsAttempted = !moved;
  } else {
    switch (receivedString) {
      case "debug":
        basic.showIcon(IconNames.Ghost);
        break;
    }
  }
  updateTimedObjects();
  handlePickups();
  renderPlayfield();
  handleGameOver();
});
function handleGameOver() {
  if (isGameOver()) {
    radio.sendString("gameOver");
    radio.sendString(player1.score > player2.score ? "p1Won" : "p2Won");
  }
}
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
  apples
    .filter(a => a.dieTime > input.runningTime())
    .forEach(a => {
      strip.setMatrixColor(
        a.pos.x,
        a.pos.y,
        neopixel.colors(NeoPixelColors.Red)
      );
    });
  players.forEach((p, ix) => {
    strip.setMatrixColor(
      p.pos.x,
      p.pos.y,
      p.outOfBoundsAttempted ? NeoPixelColors.White : p.color
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
  outOfBoundsAttempted: boolean;
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
let maxNumApples = 4;
if (input.buttonIsPressed(Button.A)) {
  maxNumApples = 1;
}
createApples(maxNumApples);
basic.showString("S");
radio.setGroup(88);
strip = neopixel.create(DigitalPin.P0, 64, NeoPixelMode.RGB);
strip.setBrightness(110);
strip.setMatrixWidth(8);
let targetScore = 10;

let player1: Player = {
  pos: randomMatrixPos(),
  score: 0,
  color: neopixel.colors(NeoPixelColors.Green),
  outOfBoundsAttempted: false
};
let player2: Player = {
  pos: randomMatrixPos(),
  score: 0,
  color: neopixel.colors(NeoPixelColors.Blue),
  outOfBoundsAttempted: false
};
let timeForInputSwitch: number = input.runningTime() + 10000;
let controlInterpretationNormal = true;
players.push(player1);
players.push(player2);
renderNativeScreen();
renderPlayfield();
radio.sendString("started");
