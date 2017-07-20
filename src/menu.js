const isElectron = typeof process !== 'undefined' && process.title !== 'browser'
const keys = require('./keys')

module.exports = (state, emitter) => {
  if (isElectron) {
    const { ipcRenderer } = require((0, 'electron'))

    const menuKeys = [
      keys.file.new,
      keys.file.open,
      keys.file.save,
      keys.file.export
    ]

    menuKeys.forEach((key) => {
      ipcRenderer.on(key, () => {
        emitter.emit(key)
      })
    })
  }
}
