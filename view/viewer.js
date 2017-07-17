const html = require('choo/html')

module.exports = (viewer, emit) => {
  return html`
    <div id="viewer" class="main">
      ${viewer.html}
    </div>
  `
}
