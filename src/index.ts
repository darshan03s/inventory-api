import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import 'dotenv/config'
import { healthRouter } from './router/health.js'

const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

app.get('/', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/health', healthRouter)

app.listen(PORT, () => {
  console.log(`Running at ${PORT}`)
})
