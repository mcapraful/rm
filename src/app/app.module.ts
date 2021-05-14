import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ExportAsModule } from 'ngx-export-as';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModulesModule } from './material/material-modules/material-modules.module';
import { AccountListComponent } from './components/account-list/account-list.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RegisterComponent } from './components/register/register.component';
import { ExpansionComponent } from './components/expansion/expansion.component';
import { ViewAccountComponent } from './components/view-account/view-account.component';
import { ActionModalComponent } from './components/action-modal/action-modal.component';
import { AccountStatementComponent } from './components/account-statement/account-statement.component';
import { GeneralReportComponent } from './components/general-report/general-report.component';
import { CurrentBetsComponent } from './components/current-bets/current-bets.component';
import { ProfitLossComponent } from './components/profit-loss/profit-loss.component';
import { MasterPasswordComponent } from './components/master-password/master-password.component';
import { BookShowComponent } from './components/book-show/book-show.component';
import { RequestInterceptorService } from './services/request-interceptor.service';
import { AdminComponent } from './components/admin/admin.component';
import { UserComponent } from './components/user/user.component';
import { BidTypeComponent } from './components/user/bid-type/bid-type.component';
import { SingleDigitComponent } from './components/user/single-digit/single-digit.component';
import { JodiComponent } from './components/user/jodi/jodi.component';
import { SpMotorComponent } from './components/user/sp-motor/sp-motor.component';
import { SinglePattiComponent } from './components/user/single-patti/single-patti.component';
import { DoublePattiComponent } from './components/user/double-patti/double-patti.component';
import { TriplePattiComponent } from './components/user/triple-patti/triple-patti.component';
import { RedBracketComponent } from './components/user/red-bracket/red-bracket.component';
import { DpMotorComponent } from './components/user/dp-motor/dp-motor.component';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { UserHomeComponent } from './components/user/user-home/user-home.component';
import { ShowResultsComponent } from './components/show-results/show-results.component';
import { FixTwoDigitDirective } from './shared/directives/fix-two-digit.directive';
import { PdfExcelDownloadComponent } from './components/pdf-download/pdf-download.component';
import { MandatoryChangePasswordComponent } from './components/mandatory-change-password/mandatory-change-password.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { MyBetComponent } from './components/my-bet/my-bet.component';
@NgModule({
  declarations: [
    AppComponent,
    FixTwoDigitDirective,
    LoginComponent,
    AccountListComponent,
    HeaderComponent,
    HomeComponent,
    DataTableComponent,
    RegisterComponent,
    ExpansionComponent,
    ViewAccountComponent,
    ActionModalComponent,
    AccountStatementComponent,
    GeneralReportComponent,
    CurrentBetsComponent,
    ProfitLossComponent,
    MasterPasswordComponent,
    BookShowComponent,
    AdminComponent,
    UserComponent,
    BidTypeComponent,
    SingleDigitComponent,
    JodiComponent,
    SpMotorComponent,
    SinglePattiComponent,
    DoublePattiComponent,
    TriplePattiComponent,
    RedBracketComponent,
    DpMotorComponent,
    SnackbarComponent,
    UserHomeComponent,
    ShowResultsComponent,
    PdfExcelDownloadComponent,
    MandatoryChangePasswordComponent,
    NotFoundComponent,
    MyBetComponent,
  ],
  imports: [
    BrowserModule,
    MaterialModulesModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxDatatableModule,
    HttpClientModule,
    FormsModule,
    ExportAsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
