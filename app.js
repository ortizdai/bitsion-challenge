import express, { json } from 'express'
import cookieParser from "cookie-parser";
import jwt from 'jsonwebtoken'
import { createUserRouter, } from './routes/users.js'
import { createAttributeRouter } from './routes/attributes.js'
import { createAdminRouter } from './routes/admin.js'
import { corsMiddleware } from './middlewares/cors.js'
import { authenticateAdmin } from './middlewares/authenticateAdmin.js'

export const createApp = ({ userModel, attributeModel, adminModel }) => {
  const app = express()
  app.use(json())

  app.use(corsMiddleware())

  app.use(cookieParser())

  app.disable('x-powered-by')

  app.use(authenticateAdmin)

  app.use('/users', createUserRouter({ userModel: userModel }))

  app.use('/attributes', createAttributeRouter({ attributeModel: attributeModel }))

  app.use('/admin', createAdminRouter({ adminModel: adminModel }))

  const PORT = process.env.PORT ?? 1234

  app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`)
  })
}