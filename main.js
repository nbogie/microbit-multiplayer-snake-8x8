radio.onReceivedString(function (receivedString) {
    led.toggle(2, 2)
    if (receivedString == "left") {
        led.toggle(0, 2)
        x += 0 - 1
    }
    if (receivedString == "right") {
        led.toggle(4, 2)
        x += 1
    }
    if (receivedString == "up") {
        led.toggle(2, 0)
        y += 1
    }
    if (receivedString == "down") {
        led.toggle(2, 4)
        y += 0 - 1
    } else {
    	
    }
    handleCollision()
    render()
})
function handleCollision () {
    if (x == xApple && y == yApple) {
        placeApple()
    }
}
function placeApple () {
    xApple = Math.randomRange(0, 7)
    yApple = Math.randomRange(0, 7)
}
input.onButtonPressed(Button.A, function () {
    radio.sendString("left")
})
input.onButtonPressed(Button.B, function () {
    radio.sendString("right")
})
input.onPinPressed(TouchPin.P1, function () {
    radio.sendString("up")
})
input.onPinPressed(TouchPin.P2, function () {
    radio.sendString("down")
})
function render () {
    strip.clear()
    strip.setMatrixColor(x, y, neopixel.colors(NeoPixelColors.Green))
    strip.setMatrixColor(xApple, yApple, neopixel.colors(NeoPixelColors.Red))
    strip.show()
}
input.onGesture(Gesture.Shake, function () {
    strip.clear()
    strip.show()
})
let yApple = 0
let xApple = 0
let y = 0
let x = 0
let strip: neopixel.Strip = null
basic.showString("s")
radio.setGroup(88)
strip = neopixel.create(DigitalPin.P0, 64, NeoPixelMode.RGB)
strip.setBrightness(150)
strip.setMatrixWidth(8)
x = 0
y = 0
placeApple()
render()
