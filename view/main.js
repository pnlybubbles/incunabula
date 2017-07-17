const html = require('choo/html')
const keys = require('../src/keys')

module.exports = (state, emit) => {
  return html`
    <body onresize=${resize} onload=${resize}>
      ${require('./editor')(state.editor, emit)}
      ${require('./viewer')(state.viewer, emit)}
    </body>
  `

  function resize (e) {
    emit(keys.resize, {
      height: window.innerHeight,
      width: window.innerWidth
    })
  }
}
