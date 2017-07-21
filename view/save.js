const html = require('choo/html')
const keys = require('../src/keys')

module.exports = (file, emit) => {
  return html`
    <div class="save floating">
      <div class="button" for="report-input" onclick=${click}>
        <i class="fa fa-cloud-download" aria-hidden="true"></i>
      </div>
      <div class="label">SAVE</div>
    </div>
  `

  function click (e) {
    emit(keys.file.save)
  }
}
