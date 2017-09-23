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
const relativePath = require('./relative-path')
const deepEqual = require('deep-equal')

let cachedOpt = null
let cachedProcessor = null

const processor = (str, opt, cb) => {
  let p = cachedProcessor
  if (!deepEqual(cachedOpt, opt)) {
    p = remark()
    .use(recommended)
    .use(relativePath, {
      base: opt.base
    })
    .use(pageBreak)
    .use(remarkCustomBlocks, {
      toc: 'toc',
      colophon: 'colophon'
    })
    .use(highlight)
    .use(math)
    .use(remark2rehype)
    .use(katex)
    .use(stringify)
    cachedProcessor = p
    cachedOpt = opt
  }
  p.process(str, (err, file) => {
    cb(
      // on electron, text decorator (like '[33m') will be revealed
      report(err || file).replace(/\[\d+m/g, ''),
      String(file),
      file.data
    )
  })
}

module.exports = processor
