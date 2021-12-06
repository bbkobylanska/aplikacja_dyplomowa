import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";

import { AddBookComponent } from './add-book/add-book.component';
import { CatalogComponent } from './catalog/catalog.component';
import { BookDetailsComponent } from './catalog/book-details/book-details.component';
import { AngularMaterialModule } from "../angular-material.module";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [
    AddBookComponent,
    CatalogComponent,
    BookDetailsComponent
  ],

  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ]
})

export class BooksModule {}
