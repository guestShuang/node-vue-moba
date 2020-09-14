const express = require('express')

const app = express()

app.set('secret', 'sdsfsf2456')

app.use(require('cors')())
app.use(express.json())
app.use('/moba', express.static(__dirname + '/web'))
app.use('/moba/admin', express.static(__dirname + '/admin'))
app.use('/uploads', express.static(__dirname + '/uploads'))

require('./plugins/db')(app)
require('./routes/admin')(app)
require('./routes/web')(app)

app.listen(3000, () => console.log(`Example app listening on port 3000!`))