import { createDocument } from 'zod-openapi'
import { loginSchema, registerSchema } from '@/zod-schemas/auth.js'
import {
  createProductSchema,
  getProductsQuerySchema,
  productIdParamsSchema,
  updateProductSchema
} from '@/zod-schemas/products.js'
import { createSupplierSchema } from '@/zod-schemas/suppliers.js'
import pkg from '../package.json' with { type: 'json' }
import { env } from './env.js'
import {
  codeResponseSchema,
  authLoginResponseSchema,
  authMeResponseSchema,
  authRefreshResponseSchema,
  createProductResponseSchema,
  createSupplierResponseSchema,
  getProductResponseSchema,
  getProductsResponseSchema,
  getSupplierResponseSchema,
  updateProductResponseSchema
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
    },

    '/api/products': {
      post: {
        tags: ['Products'],
        summary: 'Create product',
        operationId: 'createProduct',
        security: [
          {
            bearerAuth: []
          }
        ],

        requestBody: {
          required: true,

          content: {
            'application/json': {
              schema: createProductSchema,

              example: {
                name: 'Mechanical Keyboard',
                description:
                  'Wireless mechanical keyboard with RGB lighting and hot-swappable switches',
                sku: 'KEYBOARD_K8_PRO',
                price: 8999,
                stockQuantity: 20
              }
            }
          }
        },

        responses: {
          '201': {
            description: 'Product created successfully',
            content: {
              'application/json': {
                schema: createProductResponseSchema,

                example: {
                  code: 'PRODUCT_CREATED',
                  product: {
                    id: 'b4920c25-2766-4785-975f-6f901b55cb20',
                    name: 'Mechanical Keyboard',
                    sku: 'KEYBOARD_K8_PRO',
                    price: 8999,
                    stockQuantity: 20,
                    createdAt: '2026-05-16T16:12:44.704Z'
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

          '403': {
            description: 'Authenticated user does not have a supplier profile',
            content: {
              'application/json': {
                schema: codeResponseSchema,

                example: {
                  code: 'SUPPLIER_NOT_FOUND'
                }
              }
            }
          },

          '409': {
            description: 'Product SKU already exists for this supplier',
            content: {
              'application/json': {
                schema: codeResponseSchema,

                example: {
                  code: 'RESOURCE_ALREADY_EXISTS'
                }
              }
            }
          },

          '500': {
            description: 'Could not create product',
            content: {
              'application/json': {
                schema: codeResponseSchema,

                example: {
                  code: 'COULD_NOT_CREATE_PRODUCT'
                }
              }
            }
          }
        }
      },

      get: {
        tags: ['Products'],
        summary: 'List products',
        operationId: 'listProducts',
        security: [
          {
            bearerAuth: []
          }
        ],
        requestParams: {
          query: getProductsQuerySchema
        },

        responses: {
          '200': {
            description: 'Products retrieved successfully',
            content: {
              'application/json': {
                schema: getProductsResponseSchema,

                example: {
                  products: [
                    {
                      id: '7980b60c-e4bd-4778-bfb6-071609c2cf7f',
                      supplierId: '0506994f-870a-4f26-8109-1c88a782ebef',
                      name: 'Laptop Stand',
                      description:
                        'Adjustable aluminum laptop stand compatible with 13 to 17 inch laptops',
                      sku: 'STAND_ALUMINUM_PRO',
                      price: 2999,
                      stockQuantity: 35,
                      createdAt: '2026-05-16T16:25:26.512Z',
                      updatedAt: '2026-05-16T16:25:26.512Z'
                    }
                  ]
                }
              }
            }
          },

          '400': {
            description: 'Invalid query parameters',
            content: {
              'application/json': {
                schema: codeResponseSchema,

                example: {
                  code: 'INVALID_PRICE_RANGE'
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

          '403': {
            description: 'Authenticated user does not have a supplier profile',
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
    },

    '/api/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Get product',
        operationId: 'getProduct',
        security: [
          {
            bearerAuth: []
          }
        ],
        requestParams: {
          path: productIdParamsSchema
        },

        responses: {
          '200': {
            description: 'Product retrieved successfully',
            content: {
              'application/json': {
                schema: getProductResponseSchema,

                example: {
                  product: {
                    id: 'b4920c25-2766-4785-975f-6f901b55cb20',
                    supplierId: '0506994f-870a-4f26-8109-1c88a782ebef',
                    name: 'Mechanical Keyboard',
                    description:
                      'Wireless mechanical keyboard with RGB lighting and hot-swappable switches',
                    sku: 'KEYBOARD_K8_PRO',
                    price: 8999,
                    stockQuantity: 20,
                    createdAt: '2026-05-16T16:12:44.704Z',
                    updatedAt: '2026-05-16T16:20:34.995Z'
                  }
                }
              }
            }
          },

          '400': {
            description: 'Invalid product ID',
            content: {
              'application/json': {
                schema: codeResponseSchema,

                example: {
                  code: 'INVALID_PRODUCT_ID'
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

          '403': {
            description: 'Authenticated user does not have a supplier profile',
            content: {
              'application/json': {
                schema: codeResponseSchema,

                example: {
                  code: 'SUPPLIER_NOT_FOUND'
                }
              }
            }
          },

          '404': {
            description: 'Product not found',
            content: {
              'application/json': {
                schema: codeResponseSchema,

                example: {
                  code: 'PRODUCT_NOT_FOUND'
                }
              }
            }
          }
        }
      },

      patch: {
        tags: ['Products'],
        summary: 'Update product',
        operationId: 'updateProduct',
        security: [
          {
            bearerAuth: []
          }
        ],
        requestParams: {
          path: productIdParamsSchema
        },

        requestBody: {
          required: true,

          content: {
            'application/json': {
              schema: updateProductSchema,

              example: {
                price: 8999,
                stockQuantity: 20
              }
            }
          }
        },

        responses: {
          '200': {
            description: 'Product updated successfully',
            content: {
              'application/json': {
                schema: updateProductResponseSchema,

                example: {
                  code: 'PRODUCT_UPDATED',
                  product: {
                    id: 'b4920c25-2766-4785-975f-6f901b55cb20',
                    name: 'Mechanical Keyboard',
                    sku: 'KEYBOARD_K8_PRO',
                    price: 8999,
                    stockQuantity: 20,
                    createdAt: '2026-05-16T16:12:44.704Z',
                    updatedAt: '2026-05-17T08:36:42.049Z'
                  }
                }
              }
            }
          },

          '400': {
            description: 'Invalid product ID or request body',
            content: {
              'application/json': {
                schema: codeResponseSchema,

                example: {
                  code: 'AT_LEAST_ONE_FIELD_REQUIRED'
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

          '403': {
            description: 'Supplier profile not found or product belongs to another supplier',
            content: {
              'application/json': {
                schema: codeResponseSchema,

                examples: {
                  forbidden: {
                    value: {
                      code: 'FORBIDDEN'
                    }
                  },
                  supplierNotFound: {
                    value: {
                      code: 'SUPPLIER_NOT_FOUND'
                    }
                  }
                }
              }
            }
          },

          '404': {
            description: 'Product not found',
            content: {
              'application/json': {
                schema: codeResponseSchema,

                example: {
                  code: 'PRODUCT_NOT_FOUND'
                }
              }
            }
          },

          '409': {
            description: 'Product SKU already exists for this supplier',
            content: {
              'application/json': {
                schema: codeResponseSchema,

                example: {
                  code: 'RESOURCE_ALREADY_EXISTS'
                }
              }
            }
          },

          '500': {
            description: 'Could not update product',
            content: {
              'application/json': {
                schema: codeResponseSchema,

                example: {
                  code: 'COULD_NOT_UPDATE_PRODUCT'
                }
              }
            }
          }
        }
      },

      delete: {
        tags: ['Products'],
        summary: 'Delete product',
        operationId: 'deleteProduct',
        security: [
          {
            bearerAuth: []
          }
        ],
        requestParams: {
          path: productIdParamsSchema
        },

        responses: {
          '200': {
            description: 'Product deleted successfully',
            content: {
              'application/json': {
                schema: codeResponseSchema,

                example: {
                  code: 'PRODUCT_DELETED'
                }
              }
            }
          },

          '400': {
            description: 'Invalid product ID',
            content: {
              'application/json': {
                schema: codeResponseSchema,

                example: {
                  code: 'INVALID_PRODUCT_ID'
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

          '403': {
            description: 'Supplier profile not found or product belongs to another supplier',
            content: {
              'application/json': {
                schema: codeResponseSchema,

                examples: {
                  forbidden: {
                    value: {
                      code: 'FORBIDDEN'
                    }
                  },
                  supplierNotFound: {
                    value: {
                      code: 'SUPPLIER_NOT_FOUND'
                    }
                  }
                }
              }
            }
          },

          '404': {
            description: 'Product not found',
            content: {
              'application/json': {
                schema: codeResponseSchema,

                example: {
                  code: 'PRODUCT_NOT_FOUND'
                }
              }
            }
          },

          '500': {
            description: 'Could not delete product',
            content: {
              'application/json': {
                schema: codeResponseSchema,

                example: {
                  code: 'COULD_NOT_DELETE_PRODUCT'
                }
              }
            }
          }
        }
      }
    }
  }
})
