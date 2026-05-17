import { createDocument } from 'zod-openapi'
import { loginSchema, registerSchema } from '@/zod-schemas/auth.js'
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
    },

    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login user',
        operationId: 'loginUser',

        requestBody: {
          required: true,

          content: {
            'application/json': {
              schema: loginSchema
            }
          }
        },

        responses: {
          '200': {
            description: 'User logged in successfully'
          },

          '400': {
            description: 'Invalid request body'
          },

          '401': {
            description: 'Invalid credentials'
          },

          '500': {
            description: 'Internal server error'
          }
        }
      }
    },

    '/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Refresh access token',
        operationId: 'refreshAccessToken',

        responses: {
          '200': {
            description: 'Access token refreshed successfully'
          },

          '401': {
            description: 'Invalid refresh token'
          },

          '500': {
            description: 'Internal server error'
          }
        }
      }
    },

    '/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Logout user',
        operationId: 'logoutUser',

        responses: {
          '204': {
            description: 'User logged out successfully'
          },

          '500': {
            description: 'Internal server error'
          }
        }
      }
    },

    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get current user',
        operationId: 'getCurrentUser',
        security: [
          {
            bearerAuth: []
          }
        ],

        responses: {
          '200': {
            description: 'Current user retrieved successfully'
          },

          '401': {
            description: 'Unauthorized'
          },

          '404': {
            description: 'User not found'
          },

          '500': {
            description: 'Internal server error'
          }
        }
      }
    }
  }
})
