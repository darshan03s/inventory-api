import { Router, type Request, type Response } from 'express'
import { withErrorHandler } from '../error-handler.js'
import { verifySupplier } from '../middleware/suppliers.js'
import { validateRequestBody } from '../utils/index.js'
import type { CreateProductBody } from '../types/index.js'
import { createProductSchema } from '../zod-schemas/products.js'
import { ProductsRepository } from '../db/repository.js'
import { ApiError } from '../errors.js'

export const productsRouter: Router = Router()

productsRouter.post(
  '/',
  verifySupplier,
  withErrorHandler(async (req: Request<{}, {}, CreateProductBody>, res: Response) => {
    const validatedProduct = validateRequestBody(req.body, createProductSchema)

    const supplierId = req.supplierId!

    const product = await ProductsRepository.create({ ...validatedProduct, supplierId })

    if (!product) {
      throw new ApiError('COULD_NOT_CREATE_PRODUCT', 500)
    }

    return res.status(201).json({
      code: 'PRODUCT_CREATED',
      product: {
        id: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        stockQuantity: product.stockQuantity,
        createdAt: product.createdAt
      }
    })
  })
)
