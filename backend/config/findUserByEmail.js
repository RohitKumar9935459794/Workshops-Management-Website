// const db = require('./db'); // Your DB connection

// const findUserByEmail = (email) => {
//   return new Promise((resolve, reject) => {
//     db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
//       if (err) return reject(err);
//       resolve(results[0]);
//     });
//   });
// };

// module.exports = findUserByEmail;

const db = require('./db');

const findUserByEmail = async (email) => {
  try {
    const [results] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    return results[0] || null;
  } catch (error) {
    throw error;
  }
};

module.exports = findUserByEmail;
