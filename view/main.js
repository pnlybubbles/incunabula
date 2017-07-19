const html = require('choo/html')
const keys = require('../src/keys')

module.exports = (state, emit) => {
  return html`
    <body onresize=${resize} onload=${resize}>
      <div id="split">
        ${require('./editor')(state.editor, emit)}
        ${require('./viewer')(state.viewer, emit)}
      </div>
      <div class="noprint" id="overlay">
        ${require('./report')(state.viewer.report, emit)}
      </div>
    </body>
  `

  function resize (e) {
    emit(keys.resize, {
      height: window.innerHeight,
      width: window.innerWidth
    })
  }
}
