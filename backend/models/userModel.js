const db = require("../config/db");

// Find user by email using async/await
const findUserByEmail = async (email) => {
  const connection = await db.getConnection(); // get a connection from the pool
  try {
    const [results] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    return results[0] || null;
  } catch (err) {
    console.error("Error in findUserByEmail:", err);
    throw err;
  } finally {
    connection.release(); // always release the connection
  }
};

// Create user using async/await
const createUser = async (username, email, password, usertype) => {
  const connection = await db.getConnection();
  try {
    const [results] = await connection.query(
      "INSERT INTO users (username, email, password, user_type) VALUES (?, ?, ?, ?)",
      [username, email, password, usertype]
    );
    return results;
  } catch (err) {
    console.error("Error in createUser:", err);
    throw err;
  } finally {
    connection.release();
  }
};

module.exports = {
  findUserByEmail,
  createUser,
};
