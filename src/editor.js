const keys = require('./keys')

module.exports = (state, emitter) => {
  state.editor = {
    text: '',
    cursor: {
      line: 0,
      start: 0,
      end: 0
    },
    hover: false
  }

  emitter.on(keys.editor.update, (text) => {
    state.editor.text = text
    emitter.emit('render')
  })

  emitter.on(keys.editor.cursor, (cursor) => {
    state.editor.cursor = cursor
    emitter.emit('render')
  })

  emitter.on(keys.editor.hover, (isHover) => {
    state.editor.hover = isHover
    emitter.emit('render')
  })

  emitter.on(keys.editor.drop, (files) => {
    const e = state.editor
    const imageLinks = files
      .filter(v => /^image\//.test(v.type))
      .map(v => `![](${v.path})`)
      .join('\n')
    e.text = e.text.slice(0, e.cursor.start) + imageLinks + e.text.slice(e.cursor.end)
    emitter.emit('render')
  })
}
