import express, { json } from 'express'
import { createUserRouter, } from './routes/users.js'
import { createAttributeRouter } from './routes/attributes.js'
import { corsMiddleware } from './middlewares/cors.js'

export const createApp = ({ userModel, attributeModel }) => {
  const app = express()
  app.use(json())
  app.use(corsMiddleware())
  app.disable('x-powered-by')

  app.use('/users', createUserRouter({ userModel: userModel }))

  app.use('/attributes', createAttributeRouter({ attributeModel: attributeModel }))

  const PORT = process.env.PORT ?? 1234

  app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`)
  })
}