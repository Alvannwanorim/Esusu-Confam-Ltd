const express = require("express");
const dotenv = require('dotenv')
const morgan = require('morgan')
dotenv.config();

// const userRouter = require('./src/routes/userRoutes')

// const groupRouter = require('./src/routes/groupRoutes')
const connectDB = require('./src/database')

const app = express();
//Middlewares
app.use(express.json());
app.use(morgan("dev"));

///routes
app.get("/", (req, res) => {
  res.send("<h1>Welcome to The Best  media blog</h1>");
});

// User routes
// app.use("/api/users/auth", userRouter);
// app.use("/api/groups", groupRouter);

//connect to Database
connectDB();

//listen too server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server runnign on PORT: ${PORT}`));
