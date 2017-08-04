const keys = require('./keys')
const fileio = require('./fileio')
const path = require('path')
const localStorage = window.localStorage

module.exports = (state, emitter) => {
  state.file = {
    list: [{
      content: '',
      lastLoad: '',
      path: ''
    }], // { content: string, lastLoad: string, path: string }
    cached: true,
    current: 0
  }

  setInterval(() => {
    if (!state.file.cached) {
      cache()
    }
  }, 5000)

  emitter.on(keys.file.update, (text) => {
    state.file.list[state.file.current].content = text
    state.file.cached = false
  })

  emitter.on(keys.file.hotReload, () => {
    const list = localStorage.getItem('file:list')
    const current = localStorage.getItem('file:current')
    if (list && current) {
      state.file.list = JSON.parse(list)
      state.file.current = parseInt(current, 10)
      applyCurrentToEditor()
    }
  })

  emitter.on(keys.file.open, async () => {
    // TODO: support multiple files
    // temporary check unsaved current buffer
    try {
      const currentFile = state.file.list[state.file.current]
      if (currentFile.content !== currentFile.lastLoad) {
        // unsaved
        console.info(`File (${currentFile.path}) is not saved, but operating to open new file.`)
        if (window.confirm('Do you want to save the current changes?\nYour changes will be lost if you don\'t save them.')) {
          await save()
        }
      }
      const docs = await fileio.open({
        filters: [
          { name: 'Markdown', extensions: ['md'] },
          { name: 'Text', extensions: ['txt'] }
        ]
      })
      docs.forEach((doc) => {
        const item = state.file.list.find(v => v.path === doc.path)
        if (item) {
          // path is matched with the loaded item
          if (item.lastLoad !== doc.content) {
            // content is not matched with the loaded item
            // suppose: loaded item has been updated with the other editors
            console.info(`File (${doc.path}) is loaded, but content is not matched. Probably the file has been updated with the other editors.`)
          } else {
            // the doc has already loaded
            console.info(`File (${doc.path}) has already loaded.`)
            if (item.content !== doc.content) {
              // the loaded item has not beed not saved
              // TODO: replace to async dialog from confirm
              if (window.confirm('You are reloading opened file.\nDiscard changes?')) {
                item.content = doc.content
                applyCurrentToEditor()
                cache()
              }
            }
          }
        } else {
          // new file
          console.info(`Load file (${doc.path})`)
          // TODO: support multiple files
          // state.file.list.push({
          //   content: doc.content,
          //   lastLoad: doc.content,
          //   path: doc.path
          // })
          state.file.list[state.file.current] = {
            content: doc.content,
            lastLoad: doc.content,
            path: doc.path
          }
          applyCurrentToEditor()
          cache()
        }
      })
    } catch (e) {
      error(e)
    }
  })

  emitter.on(keys.file.save, async () => {
    try {
      await save()
    } catch (e) {
      error(e)
    }
  })

  emitter.on(keys.file.export, async () => {
    try {
      const currentFile = state.file.list[state.file.current]
      const config = {
        height: 257000,
        width: 182000,
        nuritashi: 3000,
        blank: 10000
      }
      const opt = {
        landscape: false,
        marginsType: 0,
        printBackground: true,
        printSelectionOnly: false,
        pageSize: {
          height: config.height + config.nuritashi * 2+ config.blank * 2,
          width: config.width + config.nuritashi * 2+ config.blank * 2
        }
      }
      const data = await fileio.pdf(opt)
      const currentFilePath = path.parse(currentFile.path)
      const defaultPath = path.format({
        dir: currentFilePath.dir,
        name: currentFilePath.name,
        ext: '.pdf'
      })
      console.log(defaultPath)
      await fileio.save(data, {
        defaultPath: defaultPath,
        buttonLabel: 'Export',
        filters: [
          { name: 'PDF', extensions: ['pdf'] }
        ]
      })
    } catch (e) {
      error(e)
    }
  })

  emitter.on(keys.file.new, async () => {
    try {
      const currentFile = state.file.list[state.file.current]
      if (currentFile.content !== currentFile.lastLoad) {
        // unsaved
        console.info(`File (${currentFile.path}) is not saved, but operating to open new file.`)
        if (window.confirm('Do you want to save the current changes?')) {
          await save()
        } else {
          return
        }
      }
      state.file.list[state.file.current] = {
        content: '',
        lastLoad: '',
        path: ''
      }
      applyCurrentToEditor()
      cache()
    } catch (e) {
      error(e)
    }
  })

  function applyCurrentToEditor () {
    emitter.emit(keys.editor.update, state.file.list[state.file.current].content)
  }

  function cache () {
    localStorage.setItem('version', fileio.version)
    localStorage.setItem('file:list', JSON.stringify(state.file.list))
    localStorage.setItem('file:current', state.file.current)
    state.file.cached = true
  }

  function error (e) {
    if (e.message !== 'Canceled') {
      window.alert(String(e))
      console.error(e)
    }
  }

  async function save () {
    const currentFile = state.file.list[state.file.current]
    if (!currentFile.path) {
      // path is empty, create new
      console.info(`New file`)
      const newPath = await fileio.save(currentFile.content, {
        filters: [
          { name: 'Markdown', extensions: ['md'] }
        ]
      })
      currentFile.path = newPath
      currentFile.lastLoad = currentFile.content
      return
    }
    const exist = await fileio.check(currentFile.path)
    let latestLoadContent = ''
    if (exist) {
      latestLoadContent = await fileio.read(currentFile.path)
    } else {
      // File is not exist. save it unconditionally.
      console.info(`File (${currentFile.path}) is not exist.`)
      latestLoadContent = currentFile.lastLoad
    }
    if (latestLoadContent !== currentFile.lastLoad) {
      // latest content is not matched with the loaded item
      // suppose: item has been updated with the other editors before save changes
      console.info(`File (${currentFile.path}) is not match to last loaded content. Probably the file has been updated with the other editors.`)
      if (window.confirm('This file is probably updated with the another application.\nOverwrite changes?')) {
        await fileio.write(currentFile.path, currentFile.content)
        currentFile.lastLoad = currentFile.content
      } else if (window.confirm('Reload file and discard changes?')) {
        currentFile.content = latestLoadContent
        currentFile.lastLoad = latestLoadContent
        applyCurrentToEditor()
        cache()
      }
    } else {
      // consistent: latest content is same as last loaded item
      console.info(`Save file (${currentFile.path})`)
      await fileio.write(currentFile.path, currentFile.content)
      currentFile.lastLoad = currentFile.content
      cache()
    }
  }
}
