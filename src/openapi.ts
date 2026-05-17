import { createDocument } from 'zod-openapi'
import { registerSchema } from '@/zod-schemas/auth.js'
import pkg from '../package.json' with { type: 'json' }
import { env } from './env.js'

export const openApiDocument: ReturnType<typeof createDocument> = createDocument({
  openapi: '3.1.0',

  info: {
    title: 'Inventory API',
    version: pkg.version,
    description: 'Inventory management REST API'
  },

  servers: [
    {
      url: env.BASE_URL
    }
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },

  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register user',
        operationId: 'registerUser',

        requestBody: {
          required: true,

          content: {
            'application/json': {
              schema: registerSchema
            }
          }
        },

        responses: {
          '201': {
            description: 'User registered successfully'
          },

          '400': {
            description: 'Invalid request body'
          },

          '409': {
            description: 'User with email already exists'
          },

          '500': {
            description: 'Internal server error'
          }
        }
      }
    }
  }
})
