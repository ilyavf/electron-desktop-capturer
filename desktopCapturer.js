// In the renderer process.
const { desktopCapturer, remote } = require('electron')
const electron = require('electron')
window.electron = electron

console.log(`Initializeing desktopCapturer...`)
desktopCapturer.getSources({ types: ['screen'] }).then(async sources => {
  console.log(`[desktopCapturer] sources=${sources.map(s => s.name).join(', ')}`, sources.map(s => s.name), sources)
  for (const source of sources) {
    if (source.name === 'Entire screen') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: source.id,
              minWidth: 3040,
              minHeight: 1200,
              maxWidth: 3040,
              maxHeight: 1200
            },
          },
        })
        handleStream(stream)
      } catch (e) {
        handleError(e)
      }
      return
    }
  }
})

const video = document.querySelector('video')
const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

function handleStream (stream) {
  video.srcObject = stream
  video.onloadedmetadata = (e) => video.play()
}

function handleError (e) {
  console.log(e)
}

const FINDER_WIDTH = 250
const FINDER_DX = 400
const FINDER_DY = 100

function captureScreenshot () {
  const win = remote.getCurrentWindow()
  const currentScreen = electron.screen.getDisplayNearestPoint({x: win.getPosition()[0], y: win.getPosition()[1]})
  console.log(`- current screen: currentScreen.bounds.x=${currentScreen.bounds.x}`, currentScreen)
  const [x, y] = remote.getCurrentWindow().getPosition()
  console.log(`- getCurrentWindow position: x=${x}, y=${y}`)
  const sx = x + FINDER_DX // - currentScreen.bounds.x
  const sy = y + FINDER_DY // - currentScreen.bounds.y

  // context.drawImage(video, 0, 0)
  context.drawImage(video, sx, sy, FINDER_WIDTH, FINDER_WIDTH, 0, 0, FINDER_WIDTH, FINDER_WIDTH)
  const img = context.getImageData(0, 0, FINDER_WIDTH, FINDER_WIDTH)
  console.log('img=', img)
}
function printCoor () {
  const win = remote.getCurrentWindow()
  const coor = {x: win.getPosition()[0], y: win.getPosition()[1]}
  showCoor(coor)
  captureSquareXY(coor)
}
function printScreen () {
  const win = remote.getCurrentWindow()
  window.win = win
  console.log(win)

  const displays = electron.screen.getAllDisplays()
  console.log(`displays:`, displays)

  const currentScreen = electron.screen.getDisplayNearestPoint({x: win.getPosition()[0], y: win.getPosition()[1]})
  window.currentScreen = currentScreen
  window.electron = electron
  console.log(`currentScreen.id = ${currentScreen.id}`)
}
function captureFullScreen () {
  context.drawImage(video, 0, 0, 250, 250)
}
function captureSquareXY ({x, y}) {
  context.drawImage(video, x, y, 250, 250, 0, 0, 250, 250)
}

const elX = document.getElementById('coorX')
const elY = document.getElementById('coorY')
let x, y
function showCoor (coor) {
  elX.innerHTML = coor.x
  elY.innerHTML = coor.y
  x = coor.x
  y = coor.y
}

printScreen()