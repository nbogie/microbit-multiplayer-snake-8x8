input.onButtonPressed(Button.A, function () {
    radio.sendString("left")
})
input.onButtonPressed(Button.B, function () {
    radio.sendString("right")
})
input.onPinPressed(TouchPin.P2, function () {
    radio.sendString("up")
})
input.onPinPressed(TouchPin.P1, function () {
    radio.sendString("down")
})
radio.onReceivedString(function (receivedString) {
    led.toggle(0, 0)
    if (receivedString == "ateApple") {
        music.playTone(pick([Note.C5, Note.D5, Note.E5, Note.G5, Note.A5]), 50)
    }
    if (receivedString == "started") {
        music.beginMelody(music.builtInMelody(Melodies.JumpUp), MelodyOptions.Once)
    } else {

    }
})
function pick(arr: any[]): any {
    return arr[Math.randomRange(0, arr.length - 1)];
}
basic.showString("2")
radio.setGroup(88)
