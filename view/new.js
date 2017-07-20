const html = require('choo/html')
const keys = require('../src/keys')

module.exports = (file, emit) => {
  return html`
    <div class="new floating">
      <div class="button" for="report-input" onclick=${click}>
        <i class="fa fa-plus-square" aria-hidden="true"></i>
      </div>
    </div>
  `

  function click (e) {
    emit(keys.file.new)
  }
}
