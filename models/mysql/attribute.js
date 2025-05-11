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
    const { user_id, attributes } = input; // Recibimos un objeto con varios atributos

    try {
      const [user] = await connection.query('SELECT * FROM user WHERE id = UUID_TO_BIN(?)', [user_id]);
      if (user.length === 0) {
        throw new Error('Usuario no encontrado');
      }

      const insertPromises = Object.keys(attributes).map(async (attribute_name) => {
        const attribute_value = attributes[attribute_name];
        const [uuidResult] = await connection.query('SELECT UUID() uuid;');
        const [{ uuid }] = uuidResult;

        await connection.query(
          `INSERT INTO attribute (id, user_id, attribute_name, attribute_value)
          VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), ?, ?);`,
          [uuid, user_id, attribute_name, attribute_value]
        );
      });

      await Promise.all(insertPromises);

      const [attributesResult] = await connection.query(
        `SELECT BIN_TO_UUID(id) id, BIN_TO_UUID(user_id) user_id, attribute_name, attribute_value
         FROM attribute WHERE user_id = UUID_TO_BIN(?)`,
        [user_id]
      );

      return attributesResult;
    } catch (e) {
      throw new Error('Error creating attributes');
    }
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