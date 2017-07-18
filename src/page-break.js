const visit = require('unist-util-visit')

module.exports = attacher

function attacher () {
  return transformer

  function transformer (tree, file) {
    file.data.pageBreak = file.data.pageBreak || []
    visit(tree, 'thematicBreak', visitor)

    function visitor (node, i, parent) {
      file.data.pageBreak.push({
        line: node.position.start.line
      })
      // parent.children[i] = {
      //   type: 'html',
      //   value: '<div class="page-break"></div>'
      // }
    }
  }
}
