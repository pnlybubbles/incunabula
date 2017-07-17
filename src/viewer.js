const md = require('./md')

module.exports = (state, emitter) => {
  state.viewer = {
    text: '',
    html: ''
  }

  setInterval(() => {
    if (state.editor.text !== state.viewer.text) {
      state.viewer.text = state.editor.text
      md(state.viewer.text, (report, html) => {
        if (/warning/.test(String(report))) {
          console.warn(report)
        } else {
          console.log(report)
        }
        state.viewer.html = html
      })
      emitter.emit('render')
    }
  }, 500)
}
