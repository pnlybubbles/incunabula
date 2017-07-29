const log = require('choo-log')
const choo = require('choo')

const app = choo()

app.use(log())
app.use(require('./src/editor'))
app.use(require('./src/viewer'))
app.use(require('./src/file'))
app.use(require('./src/ipc'))

app.route('/', require('./view/main'))

app.mount('body')
