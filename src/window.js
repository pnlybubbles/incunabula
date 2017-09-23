const isElectron = require('./is-electron')

const close = (() => {
  if (isElectron) {
    const { remote } = require((0, 'electron'))

    return () => {
      remote.getCurrentWindow().destroy()
    }
  } else {
    return (cb) => {
      throw new Error('Not implemented')
    }
  }
})()

module.exports = {
  close
}
