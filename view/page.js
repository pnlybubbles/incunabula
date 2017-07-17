const html = require('choo/html')

module.exports = (page, emit) => {
  return html`
    <section class="sheet ${page.active ? '' : 'hide'}">
      ${page.html}
    </section>
  `
}
