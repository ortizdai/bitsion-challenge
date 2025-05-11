import mysql from "mysql2/promise";
// MySQL connection configuration
const config = {
  host: "localhost",
  user: "root",
  password: "",
  database: "usersdb"
}

const connection = await mysql.createConnection(config)
console.log("Connected to MySQL database")

export class AttributeModel {

  static async getAllAttributes() {
    const [rows] = await connection.query(`SELECT BIN_TO_UUID(id) id, BIN_TO_UUID(user_id) user_id, attribute_name, attribute_value
      FROM attribute;`)
    return rows

  }
  static async createAttribute({ input }) {
    const {
      user_id,
      attribute_name,
      attribute_value,
    } = input
    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult
    try {
      await connection.query(
        `INSERT INTO attribute (id, user_id, attribute_name, attribute_value)
            VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), ?, ?);`,
        [
          uuid,
          user_id,
          attribute_name,
          attribute_value
        ]
      )
    } catch (e) {
      throw new Error('Error creating attribute', e)
    }

    const [attribute] = await connection.query(
      `SELECT BIN_TO_UUID(id) id, BIN_TO_UUID(user_id) user_id, attribute_name, attribute_value
          FROM attribute WHERE id = UUID_TO_BIN(?);`,
      [uuid]
    )

    return attribute[0]
  }


  static async updateAttribute({ id, input }) {
    const allowedFields = ['attribute_value'];
    const fields = Object.keys(input).filter(field => allowedFields.includes(field));

    if (fields.length === 0) {
      throw new Error('No hay campos válidos para actualizar');
    }

    const setClause = fields.map(field => `${field} = ?`).join(', ');

    const values = fields.map(field => input[field]);

    const [result] = await connection.query(
      `UPDATE attribute SET ${setClause} WHERE id = UUID_TO_BIN(?)`,
      [...values, id]
    );
    return result;
  }

  static async deleteAttribute({ id }) {
    try {
      const [result] = await connection.query(
        `DELETE FROM attribute WHERE id = UUID_TO_BIN(?);`,
        [id]
      )
      return result.affectedRows > 0
    }
    catch (e) {
      return false
    }
  }

}