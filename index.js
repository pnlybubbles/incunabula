const viewer = require('./src/viewer')
const md = require('./src/md')
const log = require('choo-log')
const choo = require('choo')

const app = choo()

app.use(log())
app.use(require('./src/editor'))
app.use(require('./src/viewer'))

app.route('/', require('./view/main'))

app.mount('body')

