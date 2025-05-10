import { validateUser, validatePartialUser } from '../schemas/user.js'

export class UserController {
  constructor ({ userModel }) {
    this.userModel = userModel
  }

  getAllUsers = async (req, res) => {
    const { user } = req.query
    const users = await this.userModel.getAllUsers({ user })
    res.json(users)
  }

  getUserById = async (req, res) => {
    const { id } = req.params
    const user = await this.userModel.getUserById({ id })
    if (user) return res.json(user)
    res.status(404).json({ message: 'User not found' })
  }

  createUser = async (req, res) => {
    const result = validateUser(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const newUser = await this.userModel.createUser({ input: result.data })

    res.status(201).json(newUser)
  }

  deleteUser = async (req, res) => {
    const { id } = req.params
    const result = await this.userModel.deleteUser({ id })

    if (result === false) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.json({ message: 'User deleted' })
  }

  updateUser = async (req, res) => {
    const result = validatePartialUser(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params
    const updatedUser = await this.userModel.updateUser({ id, input: result.data })

    return res.json(updatedUser)
  }
}