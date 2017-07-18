const html = require('choo/html')

module.exports = (page, isCurrentPage, emit) => {
  return html`
    <section class="sheet ${isCurrentPage ? '' : 'hide'}">
      ${page.html}
    </section>
  `
}
