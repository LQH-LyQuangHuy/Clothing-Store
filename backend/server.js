const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')

const db = require('./db')
const routes = require('./routes')

const PORT = 5000 

dotenv.config()
db.connect()

app.use(cors())
app.use(cookieParser())

app.use(express.urlencoded({
    extended : true
}))
app.use(express.json())


routes(app)

app.listen(PORT, ()=> {
    console.log(`App is starting in http://localhost:${PORT}`)
})