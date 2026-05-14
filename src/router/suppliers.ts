import { Router, type Request, type Response } from 'express'
import { withErrorHandler } from '../error-handler.js'
import { createSupplierSchema } from '../zod-schemas/suppliers.js'
import type { CreateSupplierBody } from '../types.js'
import { ApiError } from '../errors.js'
import { SuppliersRepository } from '../db/repository.js'

export const suppliersRouter: Router = Router()

suppliersRouter.post(
  '/',
  withErrorHandler(async (req: Request<{}, {}, CreateSupplierBody>, res: Response) => {
    const validationResult = createSupplierSchema.safeParse(req.body)

    if (!validationResult.success) {
      throw new ApiError('INVALID_REQUEST_BODY', 400)
    }

    const userId = req.userId!

    const supplier = await SuppliersRepository.create({ ...validationResult.data, userId })

    return res.status(201).json({
      code: 'SUPPLIER_CREATED',
      supplier
    })
  })
)

suppliersRouter.get(
  '/me',
  withErrorHandler(async (req, res) => {
    const supplier = await SuppliersRepository.getByUserId(req.userId!)

    if (!supplier) {
      throw new ApiError('SUPPLIER_NOT_FOUND', 404)
    }

    return res.json(supplier)
  })
)
