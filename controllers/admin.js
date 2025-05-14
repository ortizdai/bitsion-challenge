import { validateAdmin, validatePartialAdmin, validateAdminLogin } from "../schemas/admin.js";

export class AdminController {
    constructor({ adminModel }) {
        this.adminModel = adminModel
    }
    createAdmin = async (req, res) => {
        const result = validateAdmin(req.body);

        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message) });
        }
        try {
            const newAdmin = await this.adminModel.createAdmin({ input: result.data });
            res.status(201).json(newAdmin);
        } catch (error) {
            console.error('Error creating admin:', error);
        }
    }
    deleteAdmin = async (req, res) => {
        if (!req.session.admin) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const { id } = req.params
        const result = await this.adminModel.deleteAdmin({ id })

        if (result === false) {
            return res.status(404).json({ message: 'Admin not found' })
        }

        return res.json({ message: 'Admin deleted' })
    }

    updateAdmin = async (req, res) => {
        if (!req.session.admin) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const result = validatePartialAdmin(req.body)

        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }

        const { id } = req.params
        const updatedAdmin = await this.adminModel.updateAdmin({ id, input: result.data })

        return res.json(updatedAdmin)
    }
    getAllAdmins = async (req, res) => {
        if (!req.session.admin) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const { admin } = req.query
        const admins = await this.adminModel.getAllAdmins({ admin })
        res.json(admins)
    }
    getAdminById = async (req, res) => {
        if (!req.session.admin) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const { id } = req.params
        const user = await this.adminModel.getAdminById({ id })
        if (user) return res.json(user)
        res.status(404).json({ message: 'User not found' })
    }
    login = async (req, res) => {
        const result = validateAdminLogin(req.body);

        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }
        const { username, password } = req.body;

        try {
            const { token, admin } = await this.adminModel.login({ username, password });
            res.cookie('access_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.status(200).json({ token, admin });
        } catch (error) {
            res.status(401).json({ error: 'Invalid username or password' });
        }
    }
    logout = async (req, res) => {
        res.clearCookie('access_token');
        req.session.admin = null;
        res.status(200).json({ message: 'Logged out successfully' });
    }
}
