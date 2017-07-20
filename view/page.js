const html = require('choo/html')

module.exports = (page, isCurrentPage, emit) => {
  return html`
    <section class="sheet markdown-body ${isCurrentPage ? '' : 'hide'}">
      ${page.html.map(v => v.cloneNode(true))}
    </section>
  `
}
