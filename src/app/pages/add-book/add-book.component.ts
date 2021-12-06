import { Component, OnDestroy, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Book } from '../book.model';
import { BooksService } from '../books.service';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent implements OnInit, OnDestroy {
  enteredTitle ="";
  enteredAuthor ="";
  enteredYear ="";
  enteredCountry ="";
  enteredStory ="";
  book: Book;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = "create";
  private bookId: string;
  private authStatusSub: Subscription;

  constructor(
    public booksService: BooksService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

ngOnInit() {
  this.authService.getAuthStatusListnener().subscribe(
    authStatus => {
      this.isLoading = false;
    }
  );
  this.form = new FormGroup({
    'title': new FormControl(null, {validators: [Validators.required]}),
    'author': new FormControl(null, {validators: [Validators.required]}),
    'year': new FormControl(null, {validators: [Validators.required]}),
    'country': new FormControl(null, {validators: [Validators.required]}),
    'story': new FormControl(null, {validators: [Validators.required]}),
    'image': new FormControl (null, {
      validators: [Validators.required],
      asyncValidators: [mimeType]})
  });
  this.route.paramMap.subscribe((paramMap: ParamMap) => {
    if (paramMap.has("bookId")) {
      this.mode = "edit";
      this.bookId = paramMap.get("bookId");
      this.isLoading = true;
      this.booksService.getBook(this.bookId).subscribe(bookData => {
        this.isLoading = false;
        this.book = {
          id: bookData._id,
          title: bookData.title,
          author: bookData.author,
          year: bookData.year,
          country: bookData.country,
          story: bookData.story,
          imagePath: bookData.imagePath,
          creator: bookData.creator
        };
        this.form.setValue({
          'title': this.book.title,
          'author': this.book.author,
          'year': this.book.year,
          'country': this.book.country,
          'story': this.book.story,
          'image': this.book.imagePath
        });
      });
    } else {
      this.mode = "create";
      this.bookId = null;
    }
  });
}

onImagePicked(event: Event) {
  const file = (event.target as HTMLInputElement).files[0];
  this.form.patchValue({image: file});
  this.form.get('image').updateValueAndValidity();
  const reader = new FileReader();
  reader.onload = () => {
    this.imagePreview = reader.result as string;
  };
  reader.readAsDataURL(file);
}

  onSaveBook() {
    if(this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.booksService.addBook(
        this.form.value.title,
        this.form.value.author,
        this.form.value.year,
        this.form.value.country,
        this.form.value.story,
        this.form.value.image);
    } else {
      this.booksService.updateBook(this.bookId,
        this.form.value.title,
        this.form.value.author,
        this.form.value.year,
        this.form.value.country,
        this.form.value.story,
        this.form.value.image);
    }
    this.form.reset();
  }

  ngOnDestroy() {
    // this.authStatusSub.unsubscribe();
  }
}


