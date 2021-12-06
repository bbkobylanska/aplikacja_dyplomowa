import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

import { Subject } from "rxjs";
import { map } from "rxjs/operators";

import { environment } from "../../environments/environment";
import { Book } from "./book.model";

const BACKEND_URL = environment.apiURL + "/books/";

@Injectable({
  providedIn: "root"
})
export class BooksService {
  private books: Book[] = [];
  private booksUpdated = new Subject<{books: Book[]; bookCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getBooks(booksPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${booksPerPage}&page=${currentPage}`;
    this.http
      .get<{message: string; books: any; maxBooks: number}>(BACKEND_URL + queryParams)
      .pipe(map(bookData => {
        return {books: bookData.books.map(book => {
          return {
            title: book.title,
            author: book.author,
            year: book.year,
            country: book.country,
            story: book.story,
            id: book._id,
            imagePath: book.imagePath,
            creator: book.creator
            };
          }), maxBooks: bookData.maxBooks};
        }))
      .subscribe(transformedBookData => {
        console.log(transformedBookData);
        this.books = transformedBookData.books;
        this.booksUpdated.next({books: [...this.books], bookCount: transformedBookData.maxBooks});
      });
  }

  getBooksUpdateListener() {
    return this.booksUpdated.asObservable();
  }

  getBookDetails (id: string) {
    return {...this.books.find(b => b.id === id)};
  }

  getBook(id: string) {
    return this.http.get<{_id: string, title: string, author: string, year: string, country: string, story: string, imagePath: string, creator: string}>(BACKEND_URL + id);
  }

  addBook(title: string, author: string, year: string, country: string, story: string, image: File) {
    const bookData = new FormData();
    bookData.append("title", title);
    bookData.append("author", author);
    bookData.append("year", year);
    bookData.append("country", country);
    bookData.append("story", story);
    bookData.append("image", image, title);
    this.http
      .post<{message: string; book: Book}>(BACKEND_URL, bookData)
      .subscribe(responseData => {
        this.router.navigate([""]);
      });
  }

  updateBook(id: string, title: string, author: string, year: string, country: string, story: string, image: File | string) {
    let bookData: Book | FormData;
    if (typeof(image) === 'object') {
      bookData = new FormData();
      bookData.append("id", id);
      bookData.append("title", title);
      bookData.append("author", author);
      bookData.append("year", year);
      bookData.append("country", country);
      bookData.append("story", story);
      bookData.append("image", image, title);
    } else {
      bookData = {
        id: id,
        title: title,
        author: author,
        year: year,
        country: country,
        story: story,
        imagePath: image,
        creator: null
      };
    }
    this.http
    .put(BACKEND_URL + id, bookData)
    .subscribe(response => {
      this.router.navigate([""]);
    });
  }

  deleteBook(bookId: string) {
    return this.http.delete(BACKEND_URL + bookId);
  }
}
