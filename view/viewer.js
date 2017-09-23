const html = require('choo/html')
const keys = require('../src/keys')

module.exports = (viewer, emit) => {
  return html`
    <div id="viewer" class="main">
      <link rel="stylesheet" href="theme/${viewer.theme.name}/index.css">
      <script type="text/javascript" src="theme/${viewer.theme.name}/index.js"></script>
      <style>
        @media screen {
          #viewer .sheet {
            transform:
              translate(${viewer.style.translate})
              scale(${viewer.style.scale});
          }
        }
      </style>
      <div class="noprint button left" onclick=${page(-1)}></div>
      <div class="noprint button right" onclick=${page(1)}></div>
      <div class="noprint page-number">${viewer.currentPage.number + 1}</div>
      <div class="pages">
        <section
          class="sheet noprint ${viewer.sheet.load ? 'hide' : ''}"
          onload=${load}
        >
        </section>
        ${viewer.page.map((v, i) => {
          return require('./page')(v, viewer.currentPage.number === i, emit)
        })}
      </div>
    </div>
  `

  function load (e) {
    emit(keys.viewer.load, {
      width: e.clientWidth,
      height: e.clientHeight
    })
  }

  function page (delta) {
    return (e) => {
      emit(keys.viewer.page, {
        number: viewer.currentPage.number + delta
      })
    }
  }
}
