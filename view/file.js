const html = require('choo/html')
const keys = require('../src/keys')

module.exports = (file, emit) => {
  return html`
    <div class="file floating">
      <div class="button" for="report-input" onclick=${click}>
        <i class="fa fa-folder-open" aria-hidden="true"></i>
      </div>
      <div class="label">OPEN</div>
    </div>
  `

  function click (e) {
    emit(keys.file.open)
  }
}
