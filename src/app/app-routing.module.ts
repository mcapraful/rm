import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AccountListComponent } from './components/account-list/account-list.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { ViewAccountComponent } from './components/view-account/view-account.component';
import { AccountStatementComponent } from './components/account-statement/account-statement.component';
import { GeneralReportComponent } from './components/general-report/general-report.component';
import { CurrentBetsComponent } from './components/current-bets/current-bets.component';
import { ProfitLossComponent } from './components/profit-loss/profit-loss.component';
import { BookShowComponent } from './components/book-show/book-show.component';
import { UserComponent } from './components/user/user.component';
import { AdminComponent } from './components/admin/admin.component';
import { SingleDigitComponent } from './components/user/single-digit/single-digit.component';
import { JodiComponent } from './components/user/jodi/jodi.component';
import { SpMotorComponent } from './components/user/sp-motor/sp-motor.component';
import { DpMotorComponent } from './components/user/dp-motor/dp-motor.component';
import { SinglePattiComponent } from './components/user/single-patti/single-patti.component';
import { DoublePattiComponent } from './components/user/double-patti/double-patti.component';
import { TriplePattiComponent } from './components/user/triple-patti/triple-patti.component';
import { RedBracketComponent } from './components/user/red-bracket/red-bracket.component';
import { UserHomeComponent } from './components/user/user-home/user-home.component';
import { BidTypeComponent } from './components/user/bid-type/bid-type.component';
import { ShowResultsComponent } from './components/show-results/show-results.component';
import { PdfExcelDownloadComponent } from './components/pdf-download/pdf-download.component';
import { MandatoryChangePasswordComponent } from './components/mandatory-change-password/mandatory-change-password.component';
import { AuthenticationGuard } from './guards/authentication.guard';
import { AdminGaurdGuard } from './guards/admin-gaurd.guard';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { MyBetComponent } from './components/my-bet/my-bet.component'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'admin/login',
    component: LoginComponent,
  },
  {
    path: 'supermaster/login',
    component: LoginComponent,
  },
  {
    path: 'download',
    component: PdfExcelDownloadComponent,
  },
  {
    path: 'change-password',
    component: MandatoryChangePasswordComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path: 'dashboard',
        component: AccountListComponent,
        canActivate: [AdminGaurdGuard],
      },
      {
        path: 'register',
        component: RegisterComponent,
        canActivate: [AdminGaurdGuard],
      },
      {
        path: 'accountInfo',
        component: ViewAccountComponent,
        canActivate: [AdminGaurdGuard],
      },
      {
        path: 'account-statement',
        component: AccountStatementComponent,
      },
      {
        path: 'general-report',
        component: GeneralReportComponent,
      },
      {
        path: 'current-bet',
        component: CurrentBetsComponent,
      },
      {
        path: 'my-bet',
        component: MyBetComponent,
      },
      {
        path: 'profit-loss',
        component: ProfitLossComponent,
      },
      {
        path: 'market-analysis',
        component: BookShowComponent,
      },
      {
        path: 'results',
        component: ShowResultsComponent,
        canActivate: [AuthenticationGuard],
      },
      {
        path: 'user',
        component: UserComponent,
        canActivate: [AuthenticationGuard],
        children: [
          {
            path: 'user-dashboard',
            component: UserHomeComponent,
          },
          {
            path: 'single-digit',
            component: SingleDigitComponent,
          },
          {
            path: 'jodi',
            component: JodiComponent,
          },
          {
            path: 'sp-motor',
            component: SpMotorComponent,
          },
          {
            path: 'dp-motor',
            component: DpMotorComponent,
          },
          {
            path: 'single-patti',
            component: SinglePattiComponent,
          },
          {
            path: 'double-patti',
            component: DoublePattiComponent,
          },
          {
            path: 'triple-patti',
            component: TriplePattiComponent,
          },
          {
            path: 'red-bracket',
            component: RedBracketComponent,
          },
          {
            path: 'bid-type',
            component: BidTypeComponent,
          },
        ],
      },
      {
        path: 'admin',
        component: AdminComponent,
      },
    ],
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
