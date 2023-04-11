import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {ConfirmationPopoverModule} from 'angular-confirmation-popover';
import { LOCALE_ID } from '@angular/core';
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './login/login.component';
import { RapportComponent } from './rapport/rapport.component';
import { StockComponent } from './stock/stock.component';
import { CaisseComponent } from './caisse/caisse.component';
import { RouterModule } from '@angular/router';
import { routing} from './app.routes';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ClientsComponent } from './clients/clients.component';
import { FooterComponent } from './footer/footer.component';
import { ClientDetailComponent } from './client-detail/client-detail.component';
import {SelectModule} from 'angular2-select';
import { CaisseJourComponent } from './caisse-jour/caisse-jour.component';
import { CaisseMoisComponent } from './caisse-mois/caisse-mois.component';
import {DataServiceService} from './data-service.service';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { HeaderComponent } from './header/header.component';
import { ServicesComponent } from './services/services.component';
import { ProductService } from './product.service';
import { ClientService } from './client.service';
import { ClientserviceService } from './clientservice.service';
import { ServiceService } from './service.service';
import { StockService } from './stock.service';
import {NgxPaginationModule} from 'ngx-pagination';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    LoginComponent,
    RapportComponent,
    StockComponent,
    CaisseComponent,
    NavigationBarComponent,
    ClientsComponent,
    FooterComponent,
    ClientDetailComponent,
    CaisseJourComponent,
    CaisseMoisComponent,
    HeaderComponent,
    ServicesComponent
  ],
  imports: [
    NgbModule.forRoot(),
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'primary',
      confirmText:'Ok',
      cancelText:'Annuler'
    }),
    NgxPaginationModule,
    Ng2SearchPipeModule,
    SelectModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    RouterModule.forRoot([
      {path: '', redirectTo: '/caisse',pathMatch:'full'},
      {path: 'home', component: HomepageComponent},
      {path: 'caisse', component:RapportComponent},
      {path: 'stock', component: StockComponent},
      {path: 'clients', component: ClientsComponent},
      {path: 'caisse',component:CaisseComponent},
      {path: 'caisse-jour',component:CaisseJourComponent},
      {path: 'caisse-mois', component:CaisseMoisComponent},
      {path: 'client-detail',component:ClientDetailComponent},
      {path: 'services',component:ServicesComponent},
      {path: '',component:AppComponent}
    ])
  ],
  providers: [
    DataServiceService,
    ProductService,
    ClientService,
    ClientserviceService,
    ServiceService,
    StockService,
    {provide: LOCALE_ID,useValue: "fr-CH" }
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
