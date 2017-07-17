const html = require('choo/html')
const keys = require('../src/keys')

module.exports = (editor, emit) => {
  return html`
    <div id="editor" class="main noprint">
      <textarea oninput=${updateText}>${editor.text}</textarea>
    </div>
  `

  function updateText (e) {
    emit(keys.editor.update, e.target.value)
  }
}
