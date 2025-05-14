import mysql from "mysql2/promise";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const secretKey = process.env.JWT_SECRET;

const config = {
    host: "localhost",
    user: "root",
    password: "",
    database: "usersdb"
}

const connection = await mysql.createConnection(config)
console.log("Connected to MySQL database")

export class AdminModel {
    static async getAllAdmins() {
        const [rows] = await connection.query(`SELECT BIN_TO_UUID(id) id, username, email, full_name FROM admin;`)
        return rows
    }

    static async createAdmin({ input }) {
        const {
            full_name,
            email,
            username,
            password,
        } = input;
        const [validUserName] = await connection.query(
            'SELECT * FROM admin WHERE userName = ?',
            [username]
        );
        if (validUserName.length > 0) {
            throw new Error('Username already exists');
        }
        try {
            const [uuidResult] = await connection.query('SELECT UUID() uuid;');
            const [{ uuid }] = uuidResult;

            const passwordHash = await bcrypt.hash(password, 10);
            await connection.query(
                `INSERT INTO admin (id, username, email, full_name, password)
        VALUES (UUID_TO_BIN(?), ?, ?, ?, ?);`,
                [uuid, username, email, full_name, passwordHash]
            );

            const [adminsResult] = await connection.query(
                `SELECT BIN_TO_UUID(id) id, userName, email, full_name
         FROM admin WHERE id = UUID_TO_BIN(?)`,
                [uuid]
            );

            return adminsResult[0];
        } catch (e) {
            throw new Error('Error creating admin', e);
        }
    }

    static async updateAdmin({ id, input }) {
        const allowedFields = ['username', 'email', 'full_name', 'password'];
        const fields = Object.keys(input).filter(field => allowedFields.includes(field));

        if (fields.length === 0) {
            throw new Error('No fields to update');
        }

        if (input.password) {
            const hashedPassword = await bcrypt.hash(input.password, 10);
            input.password = hashedPassword;
        }
        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const values = fields.map(field => input[field]);
        values.push(id);

        await connection.query(`UPDATE admin SET ${setClause} WHERE id = UUID_TO_BIN(?)`, values);
    }
    static async deleteAdmin({ id }) {
        const [result] = await connection.query('DELETE FROM admin WHERE id = UUID_TO_BIN(?)', [id]);
        return result.affectedRows > 0;
    }
    static async getAdminById({ id }) {
        const [rows] = await connection.query('SELECT BIN_TO_UUID(id) id, username, email, full_name FROM admin WHERE id = UUID_TO_BIN(?)', [id]);
        return rows[0];
    };

    // Login del Admin
    static async login({ username, password }) {
        const [admins] = await connection.query(
            'SELECT BIN_TO_UUID(id) id, username, password, email, full_name FROM admin WHERE username = ?',
            [username]
        );

        if (admins.length === 0) {
            throw new Error('Admin not found');
        }

        const admin = admins[0];
        const isValid = await bcrypt.compare(password, admin.password);
        if (!isValid) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign(
            { id: admin.id, username: admin.username },
            secretKey,
            { expiresIn: '7d' }
        );

        return { token, admin: { username: admin.username, full_name: admin.full_name } };
    }

}
