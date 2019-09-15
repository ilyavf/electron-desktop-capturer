const { app, BrowserWindow } = require('electron')
// const fs = require('fs')

function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    transparent : true,
    frame: false,
    // backgroundColor: '#2e2c29',
    // vibrancy: 'selection'
  })

  // win.webContents.openDevTools()

  // and load the index.html of the app.
  win.loadFile('index.html')

  // win.webContents.on('did-finish-load', function() {
  //   win.capturePage(image => {
  //     console.log(`image::`, image)
  //     // console.log('image.toPNG::', image.toPNG())
  //     const filePath = "./IlyaImage10.png"
  //     fs.writeFile(filePath, image.toPNG(), function (err) {
  //       if(err) throw err;
  //       else console.log('Write of', filePath, 'was successful');
  //     })
  //   })
  // });
}

app.on('ready', createWindow)
