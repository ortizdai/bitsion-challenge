import { Router } from 'express'
import { AdminController } from '../controllers/admin.js'
import { cacheFor } from "../middlewares/apicache.js"

export const createAdminRouter = ({ adminModel }) => {
    const adminsRouter = Router()

    const adminController = new AdminController({ adminModel })

    adminsRouter.get('/', cacheFor(), adminController.getAllAdmins)
    adminsRouter.post('/', adminController.createAdmin)
    adminsRouter.get('/:id', adminController.getAdminById)
    adminsRouter.delete('/:id', adminController.deleteAdmin)
    adminsRouter.patch('/:id', adminController.updateAdmin)
    adminsRouter.post('/login', adminController.login)
    adminsRouter.post('/logout', adminController.logout)

    return adminsRouter
}