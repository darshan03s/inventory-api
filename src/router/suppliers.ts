import { Router, type Request, type Response } from 'express'
import { withErrorHandler } from '@/error-handler.js'
import { createSupplierSchema } from '@/zod-schemas/suppliers.js'
import { ApiError } from '@/errors.js'
import { SuppliersRepository } from '@/db/repository.js'
import { validateRequest } from '@/utils/index.js'

export const suppliersRouter: Router = Router()

suppliersRouter.post(
  '/',
  withErrorHandler(async (req: Request, res: Response) => {
    const validatedSupplier = validateRequest(req.body, createSupplierSchema)

    const userId = req.userId!

    const supplier = await SuppliersRepository.create({ ...validatedSupplier, userId })

    return res.status(201).json({
      code: 'SUPPLIER_CREATED',
      supplier
    })
  })
)

suppliersRouter.get(
  '/me',
  withErrorHandler(async (req: Request, res: Response) => {
    const supplier = await SuppliersRepository.getByUserId(req.userId!)

    if (!supplier) {
      throw new ApiError('SUPPLIER_NOT_FOUND', 404)
    }

    return res.json(supplier)
  })
)
