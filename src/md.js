const remark = require('remark')
const recommended = require('remark-preset-lint-recommended')
const html = require('remark-html')
const report = require('vfile-reporter')

const translate = (str, cb) => {
  remark()
    .use(recommended)
    .use(html)
    .process(str, (err, file) => {
      cb(report(err || file), String(file))
    })
}

module.exports = translate
