const html = require('choo/html')
const keys = require('../src/keys')
const domify = require('domify')

module.exports = (viewer, emit) => {
  return html`
    <div id="viewer" class="main">
      <style>
        @media screen {
          #viewer .sheet {
            transform:
              translate(${viewer.style.translate})
              scale(${viewer.style.scale});
          }
        }
      </style>
      <section class="sheet ${viewer.sheet.load ? 'hide' : ''}" onload=${load}>
      </section>
      <section class="sheet">
        ${domify(viewer.html)}
      </section>
    </div>
  `

  function load (e) {
    emit(keys.viewer.load, {
      width: e.clientWidth,
      height: e.clientHeight
    })
  }
}
