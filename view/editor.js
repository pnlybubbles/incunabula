const html = require('choo/html')
const keys = require('../src/keys')

module.exports = (editor, emit) => {
  return html`
    <div id="editor" class="main noprint">
      <textarea
        oninput=${updateText}
        onkeyup=${moveCursor}
        onmouseup=${moveCursor}
      >${editor.text}</textarea>
    </div>
  `

  function updateText (e) {
    emit(keys.editor.update, e.target.value)
    emit(keys.file.update, e.target.value)
  }

  function moveCursor (e) {
    const cursor = {
      line: e.target.value.slice(0, e.target.selectionStart).split('\n').length
    }
    emit(keys.editor.cursor, cursor)
    emit(keys.viewer.syncPage, cursor)
  }
}
