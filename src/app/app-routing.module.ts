import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthRoutingModule } from "./auth/auth-routing.module";
import { AuthGuard } from "./auth/auth.guard";
import { AddBookComponent } from "./pages/add-book/add-book.component";
import { BookDetailsComponent } from "./pages/catalog/book-details/book-details.component";
import { CatalogComponent } from "./pages/catalog/catalog.component";

const routes: Routes = [
  { path: '', component: CatalogComponent },
  { path: 'add', component: AddBookComponent, canActivate: [AuthGuard] },
  { path: 'edit/:bookId', component: AddBookComponent, canActivate: [AuthGuard] },
  { path: 'book/:bookId', component: BookDetailsComponent },
  { path: "auth", loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
