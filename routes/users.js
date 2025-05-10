import { Router } from 'express'
import { UserController } from '../controllers/users.js'

export const createUserRouter = ({ userModel }) => {
  const usersRouter = Router()

  const movieController = new UserController({ userModel })

  usersRouter.get('/', movieController.getAllUsers)
  usersRouter.post('/', movieController.createUser)

  usersRouter.get('/:id', movieController.getUserById)
  usersRouter.delete('/:id', movieController.deleteUser)
  usersRouter.patch('/:id', movieController.updateUser)

  return usersRouter
}