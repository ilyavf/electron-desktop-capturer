const screenshot = require('screenshot-desktop')
// const fs = require('fs')
const base64js = require('base64-js')

function capture() {
  screenshot().then((image) => {

    console.log(`- image ${typeof image}`, image)

    const base64data = base64js.fromByteArray(image)

    console.log(`base64data: `, base64data)
    document.getElementById("my-preview").setAttribute("src", 'data:image/png;base64,' + base64data)

    // const filePath = "./IlyaImage10.png"
    // fs.writeFile(filePath, image, function (err) {
    //   if(err) throw err;
    //   else console.log('Write of', filePath, 'was successful');
    // })
  }).catch((err) => {
    console.log('error::', err)
  })
}

