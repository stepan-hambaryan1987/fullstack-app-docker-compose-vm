const express = require('express');
const dotenv = require('dotenv');
const ConnectDB = require('./db/ConnectDB');
const router = require('./routes/DBOperRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

let pool;

(async () => {
  try {
    pool = await ConnectDB();

    app.use((req, res, next) => {
      req.pool = pool;
      next();
    });

    app.use("/", router);

    app.listen(port, () => {
      console.log(`✅ Backend is running on port ${port}`);
    });

  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
})();

