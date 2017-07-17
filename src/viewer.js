const md = require('./md')
const domify = require('domify')

module.exports = (state, emitter) => {
  state.viewer = {
    text: '',
    html: document.createElement('div')
  }

  setInterval(() => {
    if (state.editor.text !== state.viewer.text) {
      state.viewer.text = state.editor.text
      md(state.viewer.text, (report, htmlString) => {
        if (/warning/.test(String(report))) {
          console.warn(report)
        } else {
          console.log(report)
        }
        state.viewer.html = domify(htmlString)
      })
      emitter.emit('render')
    }
  }, 500)
}
