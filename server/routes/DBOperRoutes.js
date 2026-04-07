const express = require("express");
const router = express.Router();

// ✅ Get all users
router.get("/api/users", async (req, res) => {
  try {
    const [results] = await req.pool.query(
      `SELECT * FROM \`${process.env.DB_TABLENAME}\``
    );
    res.json(results);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).send("Internal server error");
  }
});

// ✅ Create a new user
router.post("/api/users", async (req, res) => {
  const { name, email } = req.body;

  console.log("📥 Received create request:", req.body);

  // Validate inputs
  if (!name?.trim() || !email?.trim()) {
    return res.status(400).send("All fields are required");
  }

  try {
    // Check if the user already exists
    const [checkResults] = await req.pool.query(
      `SELECT COUNT(*) AS count FROM \`${process.env.DB_TABLENAME}\` WHERE email = ?`,
      [email]
    );

    if (checkResults[0].count > 0) {
      return res.status(409).send("User already exists");
    }

    // Insert new user
    const [insertResults] = await req.pool.query(
      `INSERT INTO \`${process.env.DB_TABLENAME}\` (name, email) VALUES (?, ?)`,
      [name, email]
    );

    res.status(201).json({ id: insertResults.insertId, name, email });
  } catch (error) {
    console.error("❌ Error inserting data:", error);
    res.status(500).send("Internal server error");
  }
});

// ✅ Update user
router.put("/api/users", async (req, res) => {
  const { id, name, email } = req.body;

  if (!id || !name?.trim() || !email?.trim()) {
    return res.status(400).send("All fields are required");
  }

  try {
    // Check if the user exists
    const [check] = await req.pool.query(
      `SELECT COUNT(*) AS count FROM \`${process.env.DB_TABLENAME}\` WHERE id = ?`,
      [id]
    );

    if (check[0].count === 0) {
      return res.status(404).send("User does not exist");
    }

    // Update user
    await req.pool.query(
      `UPDATE \`${process.env.DB_TABLENAME}\` SET name = ?, email = ? WHERE id = ?`,
      [name, email, id]
    );

    res.status(200).json({ id, name, email });
  } catch (error) {
    console.error("❌ Error updating data:", error);
    res.status(500).send("Internal server error");
  }
});

// ✅ Delete user
router.delete("/api/users", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).send("All fields are required");
  }

  try {
    // Check if the user exists
    const [check] = await req.pool.query(
      `SELECT COUNT(*) AS count FROM \`${process.env.DB_TABLENAME}\` WHERE id = ?`,
      [id]
    );

    if (check[0].count === 0) {
      return res.status(404).send("User does not exist");
    }

    // Delete user
    await req.pool.query(
      `DELETE FROM \`${process.env.DB_TABLENAME}\` WHERE id = ?`,
      [id]
    );

    res.status(200).send(`User with id ${id} deleted successfully`);
  } catch (error) {
    console.error("❌ Error deleting data:", error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;

















// //imports the necessary libraries and functions
// const express = require("express")
// const router = express.Router()

// //this get function sends all the results to the client stored in the database as a json object
// router.get('/', async (req, res) => {
//     try {
//         const [results] = await req.pool.query(`SELECT * FROM ${process.env.DB_TABLENAME}`);
//         res.json(results);
//     } catch (error) {
//         //basic error handling
//         console.error('Error fetching users:', error);
//         res.status(500).send('Internal server error');
//     }
// })

// //this function checks if all the fields are filled, then checks if the user already exists then inserts the data from req.body into the database and also sends the created user to the user as a json object
// router.post("/", async (req, res) => {
//     const { name, email } = req.body;

//     // check if name or email is missing or empty
//     if (!name || !email || name === '' || email === '') {
//         return res.status(400).send('All fields are required');
//     }

//     try {
//         // check if the user already exists
//         const [checkResults] = await req.pool.query(`SELECT COUNT(*) AS count FROM ${process.env.DB_TABLENAME} WHERE email = ?`, [email]);
//         if (checkResults[0].count > 0) {
//             return res.status(409).send('User already exists');
//         }

//         // create the new user
//         const [insertResults] = await req.pool.query(`INSERT INTO ${process.env.DB_TABLENAME} (name, email) VALUES (?, ?)`, [name, email]);

//         // send a success response
//         res.status(201).json({ id: insertResults.insertId, name, email });
//     } catch (error) {
//         //basic error handling
//         console.error("Error inserting data: ", error);
//         res.status(500).send("Internal server error");
//     }
// });

// //this function updates a already created user in database by taking a id, name and email. id is used to find the user and we use the given name and email to create changes for that id's previously created name and email
// router.put("/", async (req, res) => {
//     const { id, name, email } = req.body;

//     //check if the id exists in the database
//     if (!id || !name || !email || id === "" || name === "" || email === "") {
//         return res.status(400).send('All fields are required')
//     }

//     try {
//         //check if the user exists
//         const [checkIfUserExists] = await req.pool.query(`SELECT COUNT(*) AS count FROM ${process.env.DB_TABLENAME} WHERE id = ?`, [id])

//         if (checkIfUserExists[0].count === 0) {
//             return res.status(404).send("User does not exist.")
//         }

//         //update the user
//         await req.pool.query(`UPDATE ${process.env.DB_TABLENAME} SET name = ?, email = ? where id = ?`, [name, email, id])

//         //send a success response
//         res.status(200).json({ id, name, email })
//     } catch (error) {
//         //basic error handling
//         console.error("Error updating data: ", error)
//         res.status(500).send("Internal server error")
//     }

// })

// //this function deletes a user from the database by only taking the id for the user as input from req.body
// router.delete("/", async (req, res) => {
//     const { id } = req.body;

//     //check if the id exists in the database
//     if (!id || id === "") {
//         return res.status(400).send('All fields are required')
//     }

//     try {
//         //check if the user exists
//         const [checkIfUserExists] = await req.pool.query(`SELECT COUNT(*) AS count FROM ${process.env.DB_TABLENAME} WHERE id = ?`, [id])

//         if (checkIfUserExists[0].count === 0) {
//             return res.status(404).send("User does not exist.")
//         }

//         //delete the user
//         await req.pool.query(`DELETE FROM ${process.env.DB_TABLENAME} WHERE id = ?`, [id])

//         //send a success response
//         res.status(200).send(`id ${id} deleted successfuly`)
//     } catch (error) {
//         //basic error handling
//         console.error("Error updating data: ", error)
//         res.status(500).send("Internal server error")
//     }

// })

// //exporting this router function to be using it in the index.js
// module.exports = router;
