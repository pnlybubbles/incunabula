const remark = require('remark')
const recommended = require('remark-preset-lint-recommended')
const report = require('vfile-reporter')
const math = require('remark-math')
const remark2rehype = require('remark-rehype')
const katex = require('rehype-katex')
const stringify = require('rehype-stringify')
const highlight = require('remark-highlight.js')
const remarkCustomBlocks = require('remark-custom-blocks')
const pageBreak = require('./page-break')

const processor = remark()
  .use(recommended)
  .use(pageBreak)
  .use(remarkCustomBlocks, {
    toc: 'toc'
    colophon: 'colophon'
  })
  .use(highlight)
  .use(math)
  .use(remark2rehype)
  .use(katex)
  .use(stringify)

const translator = (str, cb) => {
  processor.process(str, (err, file) => {
    cb(
      // on electron, text decorator (like '[33m') will be revealed
      report(err || file).replace(/\[\d+m/g, ''),
      String(file),
      file.data
    )
  })
}

module.exports = translator
