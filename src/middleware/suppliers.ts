import type { NextFunction, Request, Response } from 'express'
import { SuppliersRepository } from '@/db/repository.js'
import { ApiError } from '@/errors.js'

export async function verifySupplier(req: Request, res: Response, next: NextFunction) {
  const userId = req.userId!

  const supplier = await SuppliersRepository.getByUserId(userId)

  if (!supplier) {
    throw new ApiError('SUPPLIER_NOT_FOUND', 403)
  }

  req.supplierId = supplier.id

  next()
}
