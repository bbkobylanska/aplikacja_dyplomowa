import { Component, OnDestroy, OnInit } from '@angular/core';
import { BooksService } from '../../books.service';
import { Book } from '../../book.model';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css'],
})
export class BookDetailsComponent implements OnInit, OnDestroy {
  public book: Book;
  isLoading = false;
  booksPerPage = 15;
  currentPage = 1;
  private bookId: string;
  userIsAuthenticated = false;
  userId: string;
  private authStatusSub: Subscription;
  ;

  constructor(
    public booksService: BooksService,
    public route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('bookId')) {
        this.bookId = paramMap.get('bookId');
        this.book = this.booksService.getBookDetails(this.bookId);
      }
    });
    this.userId = this.authService.getUserId();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListnener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
     });
  }

  goToCatalog() {
    this.router.navigate([''])
  }

  onDelete(bookId: string) {
    this.isLoading = true;
    this.booksService.deleteBook(bookId).subscribe(() => {
      this.booksService.getBooks(this.booksPerPage, this.currentPage), () => {
        this.isLoading = false;
      };
      this.router.navigate(['']);
    });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
