import { createApp } from './app.js'

import { UserModel } from './models/mysql/user.js'
import { AttributeModel } from './models/mysql/attribute.js'
createApp({ userModel: UserModel, attributeModel: AttributeModel })