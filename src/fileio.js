const isElectron = typeof process !== 'undefined' && process.title !== 'browser'
const pify = (require('util').promisify || require('pify'))

const open = (() => {
  if (isElectron) {
    const { remote } = require('electron')
    const { dialog } = remote
    const fs = remote.require('fs')
    const readFile = pify(fs.readFile)
    const showOpenDialog = () => new Promise((resolve, reject) => {
      dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{
          name: 'Markdown / Text',
          extensions: ['md', 'txt']
        }]
      }, (files) => {
        if (files) {
          resolve(files)
        } else {
          reject('no dialog')
        }
      })
    })

    return async () => {
      let files = []
      try {
        files = await showOpenDialog()
      } catch(e) {
        return []
      }
      const docs = []
      for (let path of files) {
        docs.push({
          content: await read(path),
          path: path
        })
      }
      return docs
    }
  } else {
    return (cb) => {
      throw new Error('Not implemented')
    }
  }
})()

const read = (() => {
  if (isElectron) {
    const { remote } = require('electron')
    const fs = remote.require('fs')
    const readFile = pify(fs.readFile)

    return async (path) => {
      return (await readFile(path)).toString() // TODO: file size check
    }
  } else {
    return (path) => {
      throw new Error('Not supported')
    }
  }
})()

const write = (() => {
  if (isElectron) {
    const { remote } = require('electron')
    const fs = remote.require('fs')
    const writeFile = pify(fs.writeFile)

    return async (path, content) => {
      return await writeFile(path, content)
    }
  } else {
    return (path, content) => {
      throw new Error('Not implemented')
    }
  }
})()

const check = (() => {
  if (isElectron) {
    const { remote } = require('electron')
    const fs = remote.require('fs')
    const access = pify(fs.access)

    return async (path) => {
      return await access(path, fs.constants.R_OK | fs.constants.W_OK)
    }
  } else {
    return (path) => {
      throw new Error('Not supported')
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
  read,
  write,
  check,
  version
}
