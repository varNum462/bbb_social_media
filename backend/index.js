require("dotenv").config();
const connectDb = require("./db/db");
const usersRouter = require("./routes/users");
const aboutsRouter = require("./routes/aboutMe.js");
const postsRouter = require("./routes/posts");

const fs = require('fs');
const path = require('path');

const express = require("express");
const cors = require("cors");
const app = express();

connectDb();

app.use(cors());
app.use(express.json());
app.use(`/api/users`, usersRouter);
app.use(`/api/abouts`, aboutsRouter);
app.use(`/api/posts`, postsRouter);

app.use('/backend/uploads/images', express.static(path.join('uploads', 'images')));
app.use ((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err)  => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
