const Book = require('../models/book');

exports.addBook = (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    year: req.body.year,
    country: req.body.country,
    story: req.body.story,
    imagePath: url + "/covers/" + req.file.filename,
    creator: req.userData.userId
  });
  book.save().then(addedBook => {
      res.status(201).json({
        message: "Książka dodana pomyślnie",
        book: {
          ...addedBook,
          id: addedBook._id
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Nie udało się dodać książki"
      });
    });
}

exports.updateBook = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/covers/" + req.file.filename
  }
  const book = new Book({
    _id: req.body.id,
    title: req.body.title,
    author: req.body.author,
    year: req.body.year,
    country: req.body.country,
    story: req.body.story,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Book.updateOne({
      _id: req.params.id,
      creator: req.userData.userId
    }, book).then(result => {
      if (result.matchedCount > 0) {
        res.status(200).json({
          message: "Książka zaktualizowana pomyślnie"
        });
      } else {
        res.status(401).json({
          message: "Brak autoryzacji"
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Nie udało się zaktualizować książki"
      });
    });
}

exports.getBooks = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const bookQuery = Book.find();
  let fetchedBooks;
  if (pageSize && currentPage) {
    bookQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  bookQuery.then(documents => {
      fetchedBooks = documents;
      return Book.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Książki pobrane pomyślnie",
        books: fetchedBooks,
        maxBooks: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Nie udało się pobrać książek"
      });
    });
}

exports.getBook = (req, res, next) => {
  Book.findById(req.params.id).then(book => {
      if (book) {
        res.status(200).json(book);
      } else {
        res.status(404).json({
          message: 'Nie znaleziono książki'
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Nie udało się pobrać książki"
      });
    });
}

exports.deleteBook = (req, res, next) => {
  Book.deleteOne({
      _id: req.params.id,
      creator: req.userData.userId
    }).then(result => {
      if (result.deletedCount > 0) {
        res.status(200).json({
          message: "Książka usunięta pomyślnie"
        });
      } else {
        res.status(401).json({
          message: "Brak autoryzacji"
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Nie udało się usunąć książki"
      });
    });
}
