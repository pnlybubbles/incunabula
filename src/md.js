const remark = require('remark')
const recommended = require('remark-preset-lint-recommended')
const html = require('remark-html')
const report = require('vfile-reporter')
const math = require('remark-math')
const remark2rehype = require('remark-rehype')
const katex = require('rehype-katex')
const stringify = require('rehype-stringify')

const processor = remark()
  .use(recommended)
  .use(math)
  .use(remark2rehype)
  .use(katex)
  .use(stringify)

const translator = (str, cb) => {
  processor.process(str, (err, file) => {
    cb(report(err || file), String(file))
  })
}

module.exports = translator
