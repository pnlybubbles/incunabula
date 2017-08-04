const html = require('choo/html')

module.exports = (page, isCurrentPage, emit) => {
  return html`
    <section class="sheet markdown-body ${isCurrentPage ? '' : 'hide'}">
      <div class="tombow with-left left top"></div>
      <div class="tombow with-top left top"></div>
      <div class="tombow with-right right top"></div>
      <div class="tombow with-top right top"></div>
      <div class="tombow with-right right bottom"></div>
      <div class="tombow with-bottom right bottom"></div>
      <div class="tombow with-left left bottom"></div>
      <div class="tombow with-bottom left bottom"></div>
      ${page.html.map(v => v.cloneNode(true))}
    </section>
  `
}
