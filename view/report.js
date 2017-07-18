const html = require('choo/html')

module.exports = (report, emit) => {
  return html`
    <div class="report floating">
      <label for="report-input">
        <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
      </label>
      <input type="checkbox" id="report-input">
      <div class="tooltip">
        ${report.split('\n').map((v) => {
          const elm = document.createElement('p')
          elm.innerText = v
          return elm
        })}
      </div>
    </div>
  `
}
