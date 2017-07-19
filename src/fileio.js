const isElectron = typeof process !== 'undefined' && process.title !== 'browser'
const pify = (require('util').promisify || require('pify'))

const open = (() => {
  if (isElectron) {
    const { remote } = require('electron')
    const { dialog } = remote
    const fs = remote.require('fs')
    const readFile = pify(fs.readFile)

    return (cb) => {
      dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{
          name: 'Markdown / Text',
          extensions: ['md', 'txt']
        }]
      }, async (files) => {
        if (!files) {
          cb(null, [])
          return
        }
        try {
          const docs = []
          for (let path of files) {
            docs.push({
              content: (await readFile(path)).toString(),
              path: path
            })
          }
          cb(null, docs)
        } catch (e) {
          cb(e, null)
        }
      })
    }
  } else {
    return (cb) => {
      console.error('Not implemented')
    }
  }
})()

const version = (() => {
  if (isElectron) {
    return process.env.npm_package_version
  } else {
    return undefined
  }
})()

module.exports = {
  open,
  version
}
