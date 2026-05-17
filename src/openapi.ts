import { createDocument } from 'zod-openapi'
import { loginSchema, registerSchema } from '@/zod-schemas/auth.js'
import { createSupplierSchema } from '@/zod-schemas/suppliers.js'
import pkg from '../package.json' with { type: 'json' }
import { env } from './env.js'
import {
  codeResponseSchema,
  authLoginResponseSchema,
  authMeResponseSchema,
  authRefreshResponseSchema,
  createSupplierResponseSchema,
  getSupplierResponseSchema
} from './zod-schemas/responses.js'

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
            description: 'User registered successfully',
            content: {
              'application/json': {
                schema: codeResponseSchema,

                example: {
                  code: 'USER_REGISTERED'
                }
              }
            }
          },

          '400': {
            description: 'Invalid request body',
            content: {
              'application/json': {
                schema: codeResponseSchema,

                example: {
                  code: 'INVALID_REQUEST_BODY'
                }
              }
            }
          },

          '409': {
            description: 'User with email already exists',
            content: {
              'application/json': {
                schema: codeResponseSchema,

                example: {
                  code: 'RESOURCE_ALREADY_EXISTS'
                }
              }
            }
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
            description: 'User logged in successfully',
            content: {
              'application/json': {
                schema: authLoginResponseSchema,

                example: {
                  accessToken: 'jwt-access-token',
                  user: {
                    name: 'John Doe',
                    email: 'johndoe@email.com',
                    createdAt: '2026-05-16T08:23:26.502Z'
                  }
                }
              }
            }
          },

          '400': {
            description: 'Invalid request body',
            content: {
              'application/json': {
                schema: codeResponseSchema,

                example: {
                  code: 'INVALID_REQUEST_BODY'
                }
              }
            }
          },

          '401': {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: codeResponseSchema,

                example: {
                  code: 'INVALID_CREDENTIALS'
                }
              }
            }
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
            description: 'Refresh access token using refreshToken cookie',
            content: {
              'application/json': {
                schema: authRefreshResponseSchema,

                example: {
                  accessToken: 'jwt-access-token'
                }
              }
            }
          },

          '401': {
            description: 'Invalid refresh token',
            content: {
              'application/json': {
                schema: codeResponseSchema,

                example: {
                  code: 'INVALID_TOKEN'
                }
              }
            }
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
            description: 'Current user retrieved successfully',
            content: {
              'application/json': {
                schema: authMeResponseSchema,

                example: {
                  user: {
                    id: 'c865bdde-f5ea-4040-a8d5-ad1526ab953f',
                    name: 'John Doe',
                    email: 'johndoe@email.com',
                    createdAt: '2026-05-16T08:23:26.502Z',
                    updatedAt: '2026-05-16T08:23:26.502Z',
                    supplier: {
                      id: '0506994f-870a-4f26-8109-1c88a782ebef',
                      companyName: 'LG'
                    }
                  }
                }
              }
            }
          },

          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: codeResponseSchema,

                example: {
                  code: 'INVALID_TOKEN'
                }
              }
            }
          },

          '404': {
            description: 'User not found',
            content: {
              'application/json': {
                schema: codeResponseSchema,

                example: {
                  code: 'USER_NOT_FOUND'
                }
              }
            }
          }
        }
      }
    },

    '/api/suppliers': {
      post: {
        tags: ['Suppliers'],
        summary: 'Create supplier',
        operationId: 'createSupplier',
        security: [
          {
            bearerAuth: []
          }
        ],

        requestBody: {
          required: true,

          content: {
            'application/json': {
              schema: createSupplierSchema
            }
          }
        },

        responses: {
          '201': {
            description: 'Supplier created successfully',
            content: {
              'application/json': {
                schema: createSupplierResponseSchema,

                example: {
                  code: 'SUPPLIER_CREATED',
                  supplier: {
                    id: '0506994f-870a-4f26-8109-1c88a782ebef',
                    userId: 'c865bdde-f5ea-4040-a8d5-ad1526ab953f',
                    phone: '9876543210',
                    companyName: 'LG',
                    createdAt: '2026-05-16T08:23:26.502Z',
                    updatedAt: '2026-05-16T08:23:26.502Z'
                  }
                }
              }
            }
          },

          '400': {
            description: 'Invalid request body',
            content: {
              'application/json': {
                schema: codeResponseSchema,

                example: {
                  code: 'INVALID_REQUEST_BODY'
                }
              }
            }
          },

          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: codeResponseSchema,

                example: {
                  code: 'INVALID_TOKEN'
                }
              }
            }
          },

          '409': {
            description: 'Supplier already exists',
            content: {
              'application/json': {
                schema: codeResponseSchema,

                example: {
                  code: 'SUPPLIER_ALREADY_EXISTS'
                }
              }
            }
          }
        }
      }
    },

    '/api/suppliers/me': {
      get: {
        tags: ['Suppliers'],
        summary: 'Get current supplier',
        operationId: 'getCurrentSupplier',
        security: [
          {
            bearerAuth: []
          }
        ],

        responses: {
          '200': {
            description: 'Current supplier retrieved successfully',
            content: {
              'application/json': {
                schema: getSupplierResponseSchema,

                example: {
                  supplier: {
                    id: '0506994f-870a-4f26-8109-1c88a782ebef',
                    userId: 'c865bdde-f5ea-4040-a8d5-ad1526ab953f',
                    phone: '9876543210',
                    companyName: 'LG',
                    createdAt: '2026-05-16T08:23:26.502Z',
                    updatedAt: '2026-05-16T08:23:26.502Z'
                  }
                }
              }
            }
          },

          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: codeResponseSchema,

                example: {
                  code: 'INVALID_TOKEN'
                }
              }
            }
          },

          '404': {
            description: 'Supplier not found',
            content: {
              'application/json': {
                schema: codeResponseSchema,

                example: {
                  code: 'SUPPLIER_NOT_FOUND'
                }
              }
            }
          }
        }
      }
    }
  }
})
