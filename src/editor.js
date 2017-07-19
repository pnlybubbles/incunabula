const keys = require('./keys')

module.exports = (state, emitter) => {
  state.editor = {
    text: '',
    cursor: {
      line: 0
    }
  }

  emitter.on(keys.editor.update, (text) => {
    state.editor.text = text
    console.log(text)
    emitter.emit('render')
  })

  emitter.on(keys.editor.cursor, (cursor) => {
    state.editor.cursor = cursor
  })
}
