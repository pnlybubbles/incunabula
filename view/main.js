const html = require('choo/html')
const keys = require('../src/keys')

module.exports = (state, emit) => {
  return html`
    <body onresize=${resize} onload=${load}>
      <div id="split">
        ${require('./editor')(state.editor, emit)}
        ${require('./viewer')(state.viewer, emit)}
      </div>
      <div class="noprint" id="overlay">
        ${require('./report')(state.viewer.report, emit)}
        ${require('./file')(state.file, emit)}
        ${require('./save')(state.file, emit)}
      </div>
    </body>
  `

  function load (e) {
    resize(e)
    emit(keys.file.hotReload)
  }

  function resize (e) {
    emit(keys.resize, {
      height: window.innerHeight,
      width: window.innerWidth
    })
  }
}
