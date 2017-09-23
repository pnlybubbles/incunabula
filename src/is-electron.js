const isElectron = typeof process !== 'undefined' && process.title !== 'browser'

module.exports = isElectron
