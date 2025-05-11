import { Router } from 'express'
import { UserController } from '../controllers/users.js'

export const createUserRouter = ({ userModel }) => {
  const usersRouter = Router()

  const userController = new UserController({ userModel })

  usersRouter.get('/', userController.getAllUsers)
  usersRouter.post('/', userController.createUser)
  usersRouter.get('/:id', userController.getUserById)
  usersRouter.delete('/:id', userController.deleteUser)
  usersRouter.patch('/:id', userController.updateUser)

  return usersRouter
}