const html = require('choo/html')

module.exports = (state, emit) => {
  return html`
    <body>
      ${require('./editor')(state.editor, emit)}
      ${require('./viewer')(state.viewer, emit)}
    </body>
  `
}
