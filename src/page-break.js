const visit = require('unist-util-visit')

module.exports = attacher

function attacher() {
  return transformer

  function transformer(tree, file) {
    visit(tree, 'thematicBreak', visitor)

    function visitor(node, i, parent) {
      console.log(node)
      console.log(parent)
      parent.children[i] = {
        type: 'html',
        value: '<div class="page-break"></div>'
      }
    }
  }
}
