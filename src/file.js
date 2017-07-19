const keys = require('./keys')
const fileio = require('./fileio')
const localStorage = window.localStorage

module.exports = (state, emitter) => {
  state.file = {
    list: [], // { content: string, lastLoad: string, path: string }
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
    let docs = []
    try {
      docs = await fileio.open()
    } catch (e) {
      alert(String(e))
      console.error(e);
    }
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
        state.file.list.push({
          content: doc.content,
          lastLoad: doc.content,
          path: doc.path
        })
        applyCurrentToEditor()
        cache()
      }
    })
  })

  emitter.on(keys.file.save, async () => {
    try {
      const currentFile = state.file.list[state.file.current]
      let exist = true
      try {
        access = await fileio.check(currentFile.path)
        exist = true
      } catch (e) {
        if (e.code === 'ENOENT') {
          exist = false
        } else {
          throw e
        }
      }
      let latestLoadContent = '';
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
        console.info(`File (${currentFile.path}) is not match to last loaded content. Probably the file has been updated with the other editors.`);
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
        console.info(`Save file (${currentFile.path})`);
        await fileio.write(currentFile.path, currentFile.content)
        currentFile.lastLoad = currentFile.content
      }
    } catch (e) {
      alert(String(e))
      console.error(e);
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
}
