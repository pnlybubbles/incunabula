const visit = require('unist-util-visit')
const { isUri } = require('valid-url')
const path = require('path')

module.exports = attacher

function attacher (opt) {
  return transformer

  function transformer (tree, file) {
    visit(tree, 'image', visitor)

    function visitor (node, i, parent) {
      if (!isUri(node.url)) {
        node.url = path.resolve(opt.base, node.url)
      }
    }
  }
}
