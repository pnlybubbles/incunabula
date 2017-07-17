const html = require('choo/html')
const domify = require('domify')

module.exports = (viewer, emit) => {
  return html`
    <div id="viewer" class="main">
      <section class="sheet">
        ${domify(viewer.html)}
      </section>
    </div>
  `
}
