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
              minWidth: 1280,
              maxWidth: 1280,
              minHeight: 720,
              maxHeight: 720
            }
          }
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

function handleStream (stream) {
  video.srcObject = stream
  video.onloadedmetadata = (e) => video.play()
}

function handleError (e) {
  console.log(e)
}

function captureScreenshot () {
  let context = canvas.getContext('2d')
  context.drawImage(video, 0, 0)
  const img = context.getImageData(0, 0, 1024, 868)
  console.log('img=', img)
}
function printScreen () {
  const win = remote.getCurrentWindow()
  window.win = win
  console.log(win)

  const currentScreen = electron.screen.getDisplayNearestPoint({x: win.getPosition()[0], y: win.getPosition()[1]})
  window.currentScreen = currentScreen
  window.electron = electron
  console.log(`currentScreen.id = ${currentScreen.id}`)
}
