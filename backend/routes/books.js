const express = require("express");

const BookController = require("../controllers/book");
const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();

router.post("", checkAuth, extractFile, BookController.addBook);

router.put("/:id", checkAuth, extractFile, BookController.updateBook);

router.get("", BookController.getBooks);

router.get("/:id", BookController.getBook);

router.delete("/:id", checkAuth, BookController.deleteBook);

module.exports = router;
