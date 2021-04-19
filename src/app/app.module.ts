import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HistoryComponent } from './history/history.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdSortableHeader, UsersListComponent } from './users-list/users-list.component';
import { UserService } from './services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppService } from './services/app.service';

@NgModule({
  declarations: [
    AppComponent,
    HistoryComponent,
    HeaderComponent,
    FooterComponent,
    UsersListComponent,
    UserDetailsComponent,
    NgbdSortableHeader
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [UserService, AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
