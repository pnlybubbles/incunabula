const vivliostyle = require('vivliostyle')
const Blob = window.Blob

const viewer = (elm) => {
  const viewer = new vivliostyle.viewer.Viewer({
    userAgentRootURL: 'node_modules/vivliostyle/resources/',
    viewportElement: elm,
    debug: true
  })
  return (body) => {
    const url = window.URL.createObjectURL(new Blob(
      [
        `<html>
          <body>${body}</body>
        </html>`
      ],
      { type: 'text/html' }
    ))
    viewer.loadDocument({
      url: url,
    }, {
      userStyleSheet: [{
        text: '@page {size: ' + 'B5' + '}'
      }]
    }, {
      fitToScreen: true
    })
  }
}

module.exports = viewer
