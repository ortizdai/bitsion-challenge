import { createApp } from './app.js'

import { UserModel } from './models/mysql/user.js'
import { AttributeModel } from './models/mysql/attribute.js'
import { AdminModel } from './models/mysql/admin.js'
createApp({ userModel: UserModel, attributeModel: AttributeModel, adminModel: AdminModel })