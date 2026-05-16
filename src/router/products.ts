import { Router, type Request, type Response } from 'express'
import { withErrorHandler } from '@/error-handler.js'
import { verifySupplier } from '@/middleware/suppliers.js'
import { removeUndefinedFields, validateRequest } from '@/utils/index.js'
import {
  createProductSchema,
  getProductsQuerySchema,
  productIdParamsSchema,
  updateProductSchema
} from '@/zod-schemas/products.js'
import { ProductsRepository } from '@/db/repository.js'
import { ApiError } from '@/errors.js'
import type { ProductFilters } from '@/types/index.js'

export const productsRouter: Router = Router()

productsRouter.post(
  '/',
  verifySupplier,
  withErrorHandler(async (req: Request, res: Response) => {
    const validatedProduct = validateRequest(req.body, createProductSchema)

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
  withErrorHandler(async (req: Request, res: Response) => {
    const validatedParams = validateRequest(req.params, productIdParamsSchema)

    const validatedBody = validateRequest(req.body, updateProductSchema)

    const existingProduct = await ProductsRepository.getById(validatedParams.id)

    if (!existingProduct) {
      throw new ApiError('PRODUCT_NOT_FOUND', 404)
    }

    if (existingProduct.supplierId !== req.supplierId) {
      throw new ApiError('FORBIDDEN', 403)
    }

    const updateData = removeUndefinedFields(validatedBody)

    if (Object.keys(updateData).length === 0) {
      throw new ApiError('AT_LEAST_ONE_FIELD_REQUIRED', 400)
    }

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
    const validatedParams = validateRequest(req.params, productIdParamsSchema)

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
    const validatedParams = validateRequest(req.params, productIdParamsSchema)

    const product = await ProductsRepository.getByIdAndSupplierId(
      validatedParams.id,
      req.supplierId!
    )

    if (!product) {
      throw new ApiError('PRODUCT_NOT_FOUND', 404)
    }

    if (product.supplierId !== req.supplierId) {
      throw new ApiError('FORBIDDEN', 403)
    }

    return res.json(product)
  })
)

productsRouter.get(
  '/',
  verifySupplier,
  withErrorHandler(async (req: Request, res: Response) => {
    const validatedQuery = validateRequest(req.query, getProductsQuerySchema)

    const updatedQuery = removeUndefinedFields(validatedQuery)

    const filters: ProductFilters = {
      supplierId: req.supplierId!,
      ...updatedQuery
    }

    const products = await ProductsRepository.getMany(filters)

    return res.json(products)
  })
)
