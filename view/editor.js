const html = require('choo/html')
const keys = require('../src/keys')

module.exports = (editor, emit) => {
  return html`
    <div
      id="editor"
      class="main noprint"
      ondrop=${drop}
      ondragenter=${dragHover}
    >
      <div class="titlebar-gradient"></div>
      <div
        class="dropper ${editor.hover ? 'active' : ''}"
        ondragleave=${dragUnhover}
        ondragend=${dragUnhover}
      ></div>
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
      line: e.target.value.slice(0, e.target.selectionStart).split('\n').length,
      start: e.target.selectionStart,
      end: e.target.selectionEnd
    }
    emit(keys.editor.cursor, cursor)
    emit(keys.viewer.syncPage, cursor)
  }

  function dragHover (e) {
    emit(keys.editor.hover, true)
  }

  function dragUnhover (e) {
    emit(keys.editor.hover, false)
  }

  function drop (e) {
    dragUnhover(e)
    console.log(e.dataTransfer.files);
    emit(keys.editor.drop, Array.from(e.dataTransfer.files))
  }
}
