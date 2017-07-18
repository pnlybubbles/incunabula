const md = require('./md')
const keys = require('./keys')
const domify = require('domify')

module.exports = (state, emitter) => {
  state.viewer = {
    text: '',
    page: [], // [{ html: [HTMLElement] }]
    pageBreak: [], // [{ line: number }]
    currentPage: {
      number: 0
    },
    style: {
      scale: ''
    },
    sheet: {
      load: false,
      width: 0,
      height: 0
    },
    area: {
      load: false,
      width: 0,
      height: 0
    },
    report: ''
  }

  setInterval(() => {
    if (state.editor.text !== state.viewer.text) {
      state.viewer.text = state.editor.text
      md(state.viewer.text, (report, htmlString, data) => {
        if (/warning/.test(String(report))) {
          console.warn(report)
        } else {
          console.log(report)
        }
        state.viewer.report = String(report)
        state.viewer.pageBreak = data.pageBreak
        state.viewer.currentPage.number = getPageFromLine(
          data.pageBreak.map(v => v.line),
          state.editor.cursor.line
        )
        state.viewer.page = Array
          .from(domify(htmlString).childNodes)
          .reduce((p, n) => {
            if (n.tagName === 'HR') {
              p.unshift([])
            } else {
              p[0].push(n)
            }
            return p
          }, [[]]).reverse().map((html, i) => {
            return {
              html: html
            }
          })
        emitter.emit('render')
      })
    }
  }, 500)

  emitter.on(keys.viewer.syncPage, (cursor) => {
    state.viewer.currentPage.number = getPageFromLine(
      state.viewer.pageBreak.map(v => v.line),
      cursor.line
    )
    emitter.emit('render')
  })

  function getPageFromLine (pageBreakLineList, currentLine) {
    return pageBreakLineList.reduce((p, c, i) => {
      return c < currentLine ? i + 1 : p
    }, 0)
  }

  emitter.on(keys.viewer.page, (opt) => {
    if (opt.number >= 0 && opt.number <= state.viewer.page.length - 1) {
      state.viewer.currentPage.number = opt.number
      emitter.emit('render')
    }
  })

  emitter.on(keys.viewer.load, (size) => {
    state.viewer.sheet.load = true
    state.viewer.sheet.width = size.width
    state.viewer.sheet.height = size.height
    resize()
  })

  emitter.on(keys.resize, (size) => {
    state.viewer.area.load = true
    state.viewer.area.width = size.width / 2
    state.viewer.area.height = size.height
    resize()
  })

  function resize () {
    const a = state.viewer.area
    const s = state.viewer.sheet
    if (a.load && s.load) {
      const scale = Math.min(
        a.width / s.width,
        a.height / s.height
      ) * 0.95
      const translate = [
        (a.width - s.width) / 2,
        (a.height - s.height) / 2
      ]
      state.viewer.style.scale = String(scale)
      state.viewer.style.translate = String(translate.map(v => `${v}px`).join(','))
      emitter.emit('render')
    }
  }
}
