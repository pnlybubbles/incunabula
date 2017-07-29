const isElectron = typeof process !== 'undefined' && process.title !== 'browser'
const keys = require('./keys')
const isPlainObject = require('is-plain-object')

const deepValues = (obj) => {
  return Object.values(obj).reduce((p, c) => {
    if (isPlainObject(c)) {
      return p.concat(deepValues(c))
    } else {
      return [...p, c]
    }
  }, [])
}

module.exports = (state, emitter) => {
  if (isElectron) {
    const { ipcRenderer } = require((0, 'electron'))

    deepValues(keys).forEach((key) => {
      ipcRenderer.on(key, () => {
        emitter.emit(key)
      })
    })
  }
}
