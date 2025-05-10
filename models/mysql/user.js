import mysql from "mysql2/promise";
// MySQL connection configuration
 const config = {
  host: "localhost",
  user: "root",
  password: "",
  database: "usersdb"
 }

 const connection = await mysql.createConnection(config)

 export class UserModel {
    static async createUser({ input }) {
      const {
        full_name,
        identification,
        user_name,
        password,
        age,
        gender,
        state,
      } = input
  
      // crypto.randomUUID()
      const [uuidResult] = await connection.query('SELECT UUID() uuid;')
      const [{ uuid }] = uuidResult
  
      try {
        await connection.query(
          `INSERT INTO user (id, full_name, identification, user_name, password, age, gender, state)
            VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?, ?);`,
          [ uuid,
            full_name,
            identification,
            user_name,
            password,
            age,
            gender,
            state]
        )
      } catch (e) {
        throw new Error('Error creating user')
      }
  
      const [users] = await connection.query(
        `SELECT BIN_TO_UUID(id) id, full_name, identification, user_name, age, gender, state
          FROM user WHERE id = UUID_TO_BIN(?);`,
        [uuid]
      )
  
      return users[0]
    }

    static async getUserById({id}) {
      const [users] = await connection.query(
        `SELECT BIN_TO_UUID(id) id, full_name, identification, user_name, age, gender, state
          FROM user WHERE id = UUID_TO_BIN(?);`,
        [id]
      )
  
      return users[0]
    }
    static async getAllUsers() {
        const [rows] = await connection.query(`SELECT BIN_TO_UUID(id) id, full_name, identification, user_name, age, gender, state
          FROM user;`)
        return rows
  
    }
    static async updateUser({id, input}) {
        const allowedFields = ['full_name', 'user_name', 'age', 'gender'];
      
        const fields = Object.keys(input).filter(field => allowedFields.includes(field));
      
        if (fields.length === 0) {
          throw new Error('No hay campos válidos para actualizar');
        }
             
        const setClause = fields.map(field => `${field} = ?`).join(', ');
      
        const values = fields.map(field => input[field]);
      
        const [result] = await connection.query(
          `UPDATE user SET ${setClause} WHERE id = UUID_TO_BIN(?)`,
          [...values, id]
        );
      const updatedUser = await this.getUserById({id})
        return updatedUser;
      }

    static async deleteUser({id}) {
      try {
        const [result] = await connection.query(
          `DELETE FROM user WHERE id = UUID_TO_BIN(?);`,
          [id]
        )
        return result.affectedRows > 0
      }
      catch (error) {
        return false
      }
    }

 }