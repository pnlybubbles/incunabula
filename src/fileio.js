const isElectron = require('./is-electron')
const pify = (require('util').promisify || require('pify'))

const open = (() => {
  if (isElectron) {
    const { remote } = require((0, 'electron'))
    const { dialog } = remote
    const showOpenDialog = (opt) => new Promise((resolve, reject) => {
      dialog.showOpenDialog(remote.getCurrentWindow(), Object.assign({}, {
        properties: ['openFile']
      }, opt), (files) => {
        if (files) {
          resolve(files)
        } else {
          reject(new Error('Canceled'))
        }
      })
    })

    return async (opt) => {
      const files = await showOpenDialog(opt)
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

const save = (() => {
  if (isElectron) {
    const { remote } = require((0, 'electron'))
    const { dialog } = remote
    const showSaveDialog = (opt) => new Promise((resolve, reject) => {
      dialog.showSaveDialog(remote.getCurrentWindow(), opt, (files) => {
        if (files) {
          resolve(files)
        } else {
          reject(new Error('Canceled'))
        }
      })
    })

    return async (content, opt) => {
      let path = null
      path = await showSaveDialog(opt)
      await write(path, content)
      return path
    }
  } else {
    return (cb) => {
      throw new Error('Not implemented')
    }
  }
})()

const read = (() => {
  if (isElectron) {
    const { remote } = require((0, 'electron'))
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
    const { remote } = require((0, 'electron'))
    const fs = remote.require('fs')
    const writeFile = pify(fs.writeFile)

    return async (path, content) => {
      return writeFile(path, content)
    }
  } else {
    return (path, content) => {
      throw new Error('Not implemented')
    }
  }
})()

const check = (() => {
  if (isElectron) {
    const { remote } = require((0, 'electron'))
    const fs = remote.require('fs')
    const access = pify(fs.access)

    return async (path) => {
      try {
        await access(path, fs.constants.R_OK | fs.constants.W_OK)
        return true
      } catch (e) {
        if (e.code === 'ENOENT') {
          return false
        } else {
          throw e
        }
      }
    }
  } else {
    return (path) => {
      throw new Error('Not supported')
    }
  }
})()

const pdf = (() => {
  if (isElectron) {
    const { remote } = require((0, 'electron'))
    const webContents = remote.getCurrentWebContents()
    const printToPDF = pify(webContents.printToPDF)

    return async (opt) => {
      return printToPDF(opt)
    }
  } else {
    return (opt) => {
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
  save,
  read,
  write,
  pdf,
  check,
  version
}
