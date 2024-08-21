import express from 'express'
import apiRouter from './routes/api'

var app = express()

app.use('/api', apiRouter)

export default app