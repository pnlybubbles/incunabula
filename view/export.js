const html = require('choo/html')
const keys = require('../src/keys')

module.exports = (file, emit) => {
  return html`
    <div class="export floating">
      <div class="button" for="report-input" onclick=${click}>
        <i class="fa fa-book" aria-hidden="true"></i>
      </div>
      <div class="label">EXPORT</div>
    </div>
  `

  function click (e) {
    emit(keys.file.export)
  }
}
