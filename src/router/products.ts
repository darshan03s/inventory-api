import { Router, type Request, type Response } from 'express'
import { withErrorHandler } from '../error-handler.js'
import { verifySupplier } from '../middleware/suppliers.js'
import { removeUndefinedFields, validateRequestBody } from '../utils/index.js'
import type { CreateProductBody, UpdateProductBody } from '../types/index.js'
import {
  createProductSchema,
  productIdParamsSchema,
  updateProductSchema
} from '../zod-schemas/products.js'
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

productsRouter.patch(
  '/:id',
  verifySupplier,
  withErrorHandler(async (req: Request<{}, {}, UpdateProductBody>, res: Response) => {
    const validatedParams = validateRequestBody(req.params, productIdParamsSchema)

    const validatedBody = validateRequestBody(req.body, updateProductSchema)

    const existingProduct = await ProductsRepository.getById(validatedParams.id)

    if (!existingProduct) {
      throw new ApiError('PRODUCT_NOT_FOUND', 404)
    }

    if (existingProduct.supplierId !== req.supplierId) {
      throw new ApiError('FORBIDDEN', 403)
    }

    const updateData = removeUndefinedFields(validatedBody)

    const updatedProduct = await ProductsRepository.updateById(validatedParams.id, updateData)

    if (!updatedProduct) {
      throw new ApiError('COULD_NOT_UPDATE_PRODUCT', 500)
    }

    return res.json({
      code: 'PRODUCT_UPDATED',
      product: {
        id: updatedProduct.id,
        name: updatedProduct.name,
        sku: updatedProduct.sku,
        price: updatedProduct.price,
        stockQuantity: updatedProduct.stockQuantity,
        createdAt: updatedProduct.createdAt,
        updatedAt: updatedProduct.updatedAt
      }
    })
  })
)

productsRouter.delete(
  '/:id',
  verifySupplier,
  withErrorHandler(async (req: Request, res: Response) => {
    const validatedParams = validateRequestBody(req.params, productIdParamsSchema)

    const existingProduct = await ProductsRepository.getById(validatedParams.id)

    if (!existingProduct) {
      throw new ApiError('PRODUCT_NOT_FOUND', 404)
    }

    if (existingProduct.supplierId !== req.supplierId) {
      throw new ApiError('FORBIDDEN', 403)
    }

    const deletedProduct = await ProductsRepository.deleteById(validatedParams.id)

    if (!deletedProduct) {
      throw new ApiError('COULD_NOT_DELETE_PRODUCT', 500)
    }

    return res.status(200).json({
      code: 'PRODUCT_DELETED'
    })
  })
)

productsRouter.get(
  '/:id',
  verifySupplier,
  withErrorHandler(async (req: Request, res: Response) => {
    const validatedParams = validateRequestBody(req.params, productIdParamsSchema)

    const product = await ProductsRepository.getById(validatedParams.id)

    if (!product) {
      throw new ApiError('PRODUCT_NOT_FOUND', 404)
    }

    if (product.supplierId !== req.supplierId) {
      throw new ApiError('FORBIDDEN', 403)
    }

    return res.json(product)
  })
)
