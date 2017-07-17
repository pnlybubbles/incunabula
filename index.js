const viewer = require('./src/viewer')
const md = require('./src/md')

const renderer = viewer(document.querySelector('#viewer'))
document.querySelector('#editor textarea').value = require('./src/dummy')

let prevText = ''
setInterval(() => {
  const text = document.querySelector('#editor textarea').value
  if (prevText !== text) {
    prevText = text
    md(text, (report, html) => {
      console.warn(report)
      renderer(html)
    })
  }
}, 1000)
