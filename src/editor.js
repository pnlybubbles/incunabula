const keys = require('./keys')

module.exports = (state, emitter) => {
  state.editor = {
    text: require('./dummy')
  }

  emitter.on(keys.editor.update, (text) => {
    state.editor.text = text
    emitter.emit('render')
  })
}
