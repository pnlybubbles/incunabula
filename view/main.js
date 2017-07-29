const html = require('choo/html')
const keys = require('../src/keys')
const isElectron = require('../src/is-electron')

module.exports = (state, emit) => {
  return html`
    <body onresize=${resize} onload=${load}>
      <div id="split">
        ${require('./editor')(state.editor, emit)}
        ${require('./viewer')(state.viewer, emit)}
      </div>
      <div class="noprint" id="overlay">
        ${require('./report')(state.viewer.report, emit)}
        ${require('./export')(state.file, emit)}
        ${require('./file')(state.file, emit)}
        ${require('./save')(state.file, emit)}
        ${require('./new')(state.file, emit)}
      </div>
    </body>
  `

  function load (e) {
    resize(e)
    if (!isElectron) {
      emit(keys.file.hotReload)
    }
  }

  function resize (e) {
    emit(keys.resize, {
      height: window.innerHeight,
      width: window.innerWidth
    })
  }
}
