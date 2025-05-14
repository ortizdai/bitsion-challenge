import { Router } from 'express'
import { UserController } from '../controllers/users.js'
import { cacheFor } from "../middlewares/apicache.js"

export const createUserRouter = ({ userModel }) => {
  const usersRouter = Router()

  const userController = new UserController({ userModel })

  usersRouter.get('/', cacheFor(), userController.getAllUsers)
  usersRouter.post('/', userController.createUser)
  usersRouter.get('/:id', cacheFor(), userController.getUserById)
  usersRouter.delete('/:id', userController.deleteUser)
  usersRouter.patch('/:id', userController.updateUser)

  return usersRouter
}