const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const booksRoutes = require("./routes/books");
const userRoutes = require("./routes/user");

const app = express();

mongoose
  .connect(
    "mongodb+srv://admin:" + process.env.MONGO_ATLAS_PASSWORD + "@cluster0.5px16.mongodb.net/belles-lettres?&w=majority"
  )
  .then(() => {
    console.log("Połączono z bazą danych");
  })
  .catch(() => {
    console.log("Nie udało się połączyć z bazą danych");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use("/covers", express.static(path.join("covers")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS, PUT");
  next();
});

app.use("/api/books", booksRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
