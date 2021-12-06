import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { Book } from '../book.model';
import { BooksService } from '../books.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit, OnDestroy {

  books: Book[] = [];
  isLoading = false;
  totalBooks = 0;
  booksPerPage = 15;
  currentPage = 1;
  pageSizeOptions = [15, 30, 45];

  private booksSub: Subscription;

  constructor(
    public booksService: BooksService
    ) {}

  ngOnInit() {
    this.isLoading = true;
    this.booksService.getBooks(this.booksPerPage, this.currentPage);
    this.booksSub = this.booksService.getBooksUpdateListener()
      .subscribe((bookData: {books: Book[], bookCount: number}) => {
        this.isLoading = false;
        this.totalBooks = bookData.bookCount;
        this.books = bookData.books;
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.booksPerPage = pageData.pageSize;
    this.booksService.getBooks(this.booksPerPage, this.currentPage);
  }

  ngOnDestroy() {
    this.booksSub.unsubscribe();
  }
}

