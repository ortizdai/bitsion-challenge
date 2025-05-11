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
        [uuid,
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

  static async getUserById({ id }) {
    const [users] = await connection.query(
      `SELECT 
      BIN_TO_UUID(u.id) AS id,
      u.full_name,
      u.identification,
      u.age,
      u.gender,
      u.state,
      a.attribute_name,
      a.attribute_value
    FROM user u
    LEFT JOIN attribute a ON u.id = a.user_id
    WHERE u.id = UUID_TO_BIN(?)`,
      [id]
    )
    if (users.length === 0) return null;
    const attributes = {};
    users.forEach(attr => {
      if (attr.attribute_name) {
        attributes[attr.attribute_name] = attr.attribute_value;
      }
    });
    const user = {
      id: users[0].id,
      full_name: users[0].full_name,
      identification: users[0].identification,
      age: users[0].age,
      gender: users[0].gender,
      state: users[0].state,
      attributes
    };
    return user
  }
  static async getAllUsers() {
    const [usersData] = await connection.query(
      `SELECT 
        BIN_TO_UUID(u.id) AS id,
        u.full_name,
        u.identification,
        u.age,
        u.gender,
        u.state,
        a.attribute_name,
        a.attribute_value
      FROM user u
      LEFT JOIN attribute a ON u.id = a.user_id`
    );
    if (usersData.length === 0) return [];

    const usersMap = new Map();

    usersData.forEach(row => {
      if (!usersMap.has(row.id)) {
        usersMap.set(row.id, {
          id: row.id,
          full_name: row.full_name,
          identification: row.identification,
          age: row.age,
          gender: row.gender,
          state: row.state,
          attributes: []
        });
      }

      if (row.attribute_name) {
        usersMap.get(row.id).attributes[row.attribute_name] = row.attribute_value;
      }
    });

    return Array.from(usersMap.values());
  }

  static async updateUser({ id, input }) {
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
    const updatedUser = await this.getUserById({ id })
    return updatedUser;
  }

  static async deleteUser({ id }) {
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