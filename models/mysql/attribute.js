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

      for (const attr of attributes) {

        await connection.query(
          `INSERT INTO attribute (id, user_id, attribute_name, attribute_value)
            VALUES (UUID_TO_BIN(UUID()), UUID_TO_BIN(?), ?, ?);`,
          [user_id, attr.name, attr.value]
        );
      }

      const [attributesResult] = await connection.query(
        `SELECT BIN_TO_UUID(id) id, BIN_TO_UUID(user_id) user_id, attribute_name, attribute_value
         FROM attribute WHERE user_id = UUID_TO_BIN(?)`,
        [user_id]
      );

      return attributesResult;
    } catch (e) {
      throw new Error('Error creating attributes', e);
    }
  }


  static async updateAttribute({ input }) {
    const attributes = input;

    if (attributes?.length === 0) {
      throw new Error('No hay campos para actualizar');
    }
    try {
      let result
      for (const attr of attributes) {
        result = await connection.query(
          `UPDATE attribute SET attribute_value = ? WHERE id = UUID_TO_BIN(?)`,
          [attr.value, attr.id]
        );
      }


      if (result.affectedRows === 0) {
        console.warn('No se actualizó ningún registro. Verificar si el ID existe y si los valores realmente cambiaron.');
      }
      return { message: 'Atributos actualizados', result }
    } catch (e) {
      throw new Error('Error updating attribute', e);

    }

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