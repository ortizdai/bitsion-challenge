import { Router } from 'express'
import { AttributeController } from '../controllers/attributes.js'

export const createAttributeRouter = ({ attributeModel }) => {
  const attributesRouter = Router()

  const attributeController = new AttributeController({ attributeModel })

  attributesRouter.post('/', attributeController.createAttribute)
  attributesRouter.get('/', attributeController.getAllAttributes)
  attributesRouter.delete('/:id', attributeController.deleteAttribute)
  attributesRouter.patch('/:id', attributeController.updateAttribute)

  return attributesRouter
}