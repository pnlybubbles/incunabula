// https://electron.atom.io/docs/tutorial/quick-start/
const {app, BrowserWindow, Menu, shell} = require('electron')
const defaultMenu = require('electron-default-menu')
const { updateMenu, getMenu } = require('./src/menu-util')
const path = require('path')
const url = require('url')
const keys = require('./src/keys')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
let willQuit = false

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({titleBarStyle: 'hidden', width: 1200, height: 900})

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  const menuFile = getMenu(menu, 'file')

  // Open the DevTools.
  // win.webContents.openDevTools()

  win.on('close', (e) => {
    if (win && !win.webContents.isLoading()) {
      if (!willQuit) {
        e.preventDefault()
        win.webContents.send(keys.close)
      }
    }
  })

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null

    updateMenu(['file:save'], menuFile, {
      enabled: false
    })

    updateMenu(['file:export'], menuFile, {
      enabled: false
    })
  })

  win.webContents.on('did-finish-load', () => {
    updateMenu(['file:save'], menuFile, {
      enabled: true
    })

    updateMenu(['file:export'], menuFile, {
      enabled: true
    })
  })
}

let menu

function createMenu () {
  // Create the application menu.
  const menuTemplate = defaultMenu(app, shell)

  menuTemplate.find(v => v.label === 'Help').submenu.push({
    label: 'Website',
    click: () => shell.openExternal('https://github.com/pnlybubbles/incunabula')
  })

  menuTemplate.splice(1, 0, {
    label: 'File',
    id: 'file',
    submenu: [
      {
        label: 'New File',
        accelerator: 'CmdOrCtrl+N',
        enabled: true,
        click: () => {
          if (win && !win.webContents.isLoading()) {
            win.webContents.send(keys.file.new)
          } else {
            createWindow()
            win.webContents.on('did-finish-load', () => {
              win.webContents.send(keys.file.new)
            })
          }
        },
        id: 'file:new'
      },
      {
        label: 'Open',
        accelerator: 'CmdOrCtrl+O',
        enabled: true,
        click: () => {
          if (win && !win.webContents.isLoading()) {
            win.webContents.send(keys.file.open)
          } else {
            createWindow()
            win.webContents.on('did-finish-load', () => {
              win.webContents.send(keys.file.open)
            })
          }
        },
        id: 'file:open'
      },
      {
        type: 'separator'
      },
      {
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        enabled: false,
        click: () => {
          if (win && !win.webContents.isLoading()) {
            win.webContents.send(keys.file.save)
          }
        },
        id: 'file:save'
      },
      {
        type: 'separator'
      },
      {
        label: 'Export PDF...',
        accelerator: 'CmdOrCtrl+Alt+P',
        enabled: false,
        click: () => {
          if (win && !win.webContents.isLoading()) {
            win.webContents.send(keys.file.export)
          }
        },
        id: 'file:export'
      }
    ]
  })

  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate))

  menu = Menu.getApplicationMenu()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  app.commandLine.appendSwitch('js-flags', '--harmony')
  createMenu()
  createWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

app.on('before-quit', () => {
  willQuit = true
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
