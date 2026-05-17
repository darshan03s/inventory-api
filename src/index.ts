import express, { type NextFunction, type Request, type Response } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import 'dotenv/config'
import { healthRouter } from './router/health.js'
import { testRouter } from './router/test.js'
import { ApiError } from './errors.js'
import { authRouter } from './router/auth.js'
import { isUniqueViolation } from './db/utils.js'
import cookieParser from 'cookie-parser'
import { suppliersRouter } from './router/suppliers.js'
import { verifyAccessToken } from './middleware/auth.js'
import { productsRouter } from './router/products.js'
import { env } from './env.js'
import { openApiDocument } from './openapi.js'
import { apiReference } from '@scalar/express-api-reference'

const app = express()

const PORT = env.PORT

const allowedOrigins = [env.CORS_ORIGIN].filter(Boolean)

app.use(express.json())
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
)
app.use(morgan('dev'))
app.use(cookieParser())

app.get('/openapi.json', (req, res) => {
  return res.json(openApiDocument)
})

app.use(
  '/docs',
  apiReference({
    content: openApiDocument
  })
)

app.get('/', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/health', healthRouter)

app.use('/test', testRouter)

app.use('/auth', authRouter)

app.use('/api/suppliers', verifyAccessToken, suppliersRouter)

app.use('/api/products', verifyAccessToken, productsRouter)

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  if (isUniqueViolation(error)) {
    return res.status(409).json({
      code: 'RESOURCE_ALREADY_EXISTS'
    })
  }

  if (error instanceof ApiError) {
    return res.status(error.status).json({
      code: error.code
    })
  }

  console.error(error)

  return res.status(500).json({
    code: 'INTERNAL_SERVER_ERROR'
  })
})

app.listen(PORT, () => {
  console.log(`Running at ${PORT}`)
})
