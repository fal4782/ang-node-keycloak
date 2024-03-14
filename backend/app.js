const dotenv = require("dotenv");
const express = require("express");
require('./db/connection')
const cors = require("cors");
const authRouter = require("./api/authRoutes");
const protectedRouter = require("./api/protectedRoutes")

dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use("/auth",authRouter);
app.use(protectedRouter)

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});